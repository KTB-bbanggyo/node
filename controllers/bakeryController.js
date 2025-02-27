const express = require('express');
const axios = require('axios');
const { QueryTypes } = require('sequelize');
const db = require('../models'); // Sequelize 모델
const { User, Bakery, FavoriteBakery } = db;

const router = express.Router();

// 1. 사용자 입력을 AI API로 전달하고 빵집 데이터를 받아 유저에게 반환하는 API
exports.processBakeryRequest = async (req, res) => {
    try {
        const { userId, prompt, favorites, bakeries } = req.body;

        if (!userId || !prompt) {
            return res.status(400).json({ message: 'userId와 prompt를 입력해야 합니다.', error: 'Bad Request' });
        }

        // 사용자의 찜한 빵집 목록 조회
        let validFavorites = [];
        if (favorites && Array.isArray(favorites) && favorites.length > 0) {
            const result = await db.sequelize.query(
                `SELECT b.name 
                 FROM FavoriteBakery f
                 JOIN Bakery b ON f.bakery_id = b.bakery_id
                 WHERE b.name IN (:favorites)`,
                {
                    replacements: { favorites },
                    type: QueryTypes.SELECT
                }
            );
            validFavorites = result.map(row => row.name);
        }

        const user = await User.findByPk(userId, {
            include: [{ model: Bakery, as: 'favorites', through: { attributes: [] } }]
        });

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.', error: 'Not Found' });
        }

        const userFavorites = user.favorites.map(bakery => bakery.name);
        const allFavorites = [...new Set([...validFavorites, ...userFavorites])];

        const formattedPrompt = encodeURIComponent(
            `${prompt}\n사용자가 찜한 빵집이야. 참고해. 꼭 찜한 빵집들 위주로 추천할 필요는 없어.\n{${allFavorites.join(', ')}}`
        );

        let externalResponseData = null;
        try {
            const aiUrl = `http://lb-bbanggyo-master-azone-1386370116.ap-northeast-2.elb.amazonaws.com:8000/recommend?prompt=${formattedPrompt}`;
            const aiResponse = await axios.get(aiUrl);
            externalResponseData = aiResponse.data;
        } catch (error) {
            console.error('❌ AI 서버 호출 오류:', error.message);
        }

        return res.status(200).json({
            message: '✅ AI 응답 및 빵집 리스트 전달 완료!',
            promptUsed: prompt,
            data: {
                receivedBakeries: bakeries || [],
                externalRecommend: externalResponseData
            }
        });
    } catch (error) {
        console.error('❌ 처리 중 오류 발생:', error);
        return res.status(500).json({ message: '서버 내부 오류', error: error.message });
    }
};

// 2. 특정 유저가 단일 빵집 찜
exports.addFavoriteBakery = async (req, res) => {
    try {
        const { user_id, bakery_id } = req.body;
        if (!user_id || !bakery_id) {
            return res.status(400).json({ message: 'user_id, bakery_id 모두 필요합니다.' });
        }

        const exists = await FavoriteBakery.findOne({ where: { user_id, bakery_id } });
        if (exists) {
            return res.status(409).json({ message: '이미 찜한 빵집입니다.' });
        }

        await FavoriteBakery.create({ user_id, bakery_id });
        return res.status(201).json({ message: '✅ 빵집 찜 등록 완료!' });
    } catch (err) {
        console.error('❌ 찜 등록 오류:', err);
        return res.status(500).json({ message: '서버 내부 오류' });
    }
};

// 3. 특정 유저가 찜한 빵집 조회
exports.getUserFavoriteBakeries = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'userId 파라미터가 필요합니다.' });
        }

        const favorites = await db.sequelize.query(`
            SELECT b.bakery_id, b.name, b.address, b.phone, b.rating, b.keywords
            FROM FavoriteBakery f
            JOIN Bakery b ON f.bakery_id = b.bakery_id
            WHERE f.user_id = :userId
        `, {
            replacements: { userId },
            type: QueryTypes.SELECT
        });

        if (!favorites.length) {
            return res.status(404).json({ message: '찜한 빵집이 없습니다.' });
        }

        return res.status(200).json(favorites);
    } catch (err) {
        console.error('❌ 찜 목록 조회 오류:', err);
        return res.status(500).json({ message: '서버 내부 오류' });
    }
};
