-- 데이터베이스 생성 (존재하지 않으면 생성)
CREATE DATABASE IF NOT EXISTS mydb;

USE mydb;

-- 사용자 테이블 (OAuth 및 로컬 로그인 포함)
CREATE TABLE IF NOT EXISTS Users (
    user_id         BIGINT AUTO_INCREMENT PRIMARY KEY, -- 내부적으로 사용하는 사용자 고유 ID
    kakao_id       BIGINT UNIQUE, -- 카카오 로그인에서 제공하는 고유 ID (NULL 허용: 로컬 회원가입 가능)
    username       VARCHAR(255) UNIQUE, -- 로컬 로그인 시 유저네임
    user_password  VARCHAR(255), -- 로컬 로그인 시 비밀번호 (암호화 필요)
    email          VARCHAR(255), -- 이메일
    provider       ENUM('LOCAL', 'KAKAO') NOT NULL, -- 로그인 방식
    nickname       VARCHAR(50), -- 사용자 닉네임
    profile_image  TEXT, -- 프로필 이미지 URL
    age_range      VARCHAR(20), -- 연령대 ("20-29", "30-39" 등)
    gender         ENUM('male', 'female', 'other'), -- 성별
    llm_thread_id  VARCHAR(100) -- LLM 대화방 ID
);


-- 빵집 정보 
CREATE TABLE IF NOT EXISTS Bakery (
    bakery_id     BIGINT AUTO_INCREMENT PRIMARY KEY, 
    name          VARCHAR(255) NOT NULL, 
    address       VARCHAR(255) NOT NULL,  
    phone         VARCHAR(20), 
    rating        DECIMAL(3,2) DEFAULT 0, 
    keywords      JSON -- 키워드 정보 저장 (예: ["크로와상", "디저트 맛집", "주차 가능"])
);


-- 찜한 빵집 (마이페이지 - 찜.빵)
CREATE TABLE IF NOT EXISTS FavoriteBakery (
    user_id       BIGINT, 
    bakery_id     BIGINT, 
    PRIMARY KEY (user_id, bakery_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (bakery_id) REFERENCES Bakery(bakery_id) ON DELETE CASCADE
);

-- 로그인 세션 관리 (JWT 또는 세션 기반 인증)
CREATE TABLE IF NOT EXISTS Login_Sessions (
    session_id    BIGINT AUTO_INCREMENT PRIMARY KEY, 
    user_id       BIGINT NOT NULL, 
    session_token VARCHAR(255) UNIQUE NOT NULL, 
    expires_at    TIMESTAMP NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 1. 사용자 데이터 삽입
INSERT INTO Users (user_id, kakao_id, username, user_password, email, provider, nickname, profile_image, age_range, gender, llm_thread_id) VALUES
(1, 123456789, 'kimchulsoo', 'hashed_password_1', 'chulsoo@example.com', 'LOCAL', '철수', 'https://example.com/profiles/chulsoo.jpg', '20-29', 'male', 'thread_001'),
(2, 987654321, 'leeyounghee', 'hashed_password_2', 'younghee@example.com', 'KAKAO', '영희', 'https://example.com/profiles/younghee.jpg', '30-39', 'female', 'thread_002'),
(3, NULL, 'john_doe', 'hashed_password_3', 'johndoe@example.com', 'LOCAL', 'John', 'https://example.com/profiles/john.jpg', '40-49', 'male', 'thread_003'),
(4, 112233445, 'alice123', 'hashed_password_4', 'alice@example.com', 'KAKAO', 'Alice', 'https://example.com/profiles/alice.jpg', '20-29', 'female', 'thread_004');

-- 2. 빵집 데이터 삽입
INSERT INTO Bakery (bakery_id, name, address, phone, rating, keywords) VALUES
(1, '맛있는 빵집', '서울 강남구 삼성동 123-4', '02-1234-5678', 4.8, '["크로와상", "디저트 맛집", "주차 가능"]'),
(2, '고소한 베이커리', '서울 마포구 합정동 56-7', '02-8765-4321', 4.6, '["식빵", "아메리카노", "애견 동반 가능"]'),
(3, '바삭한 크루아상', '부산 해운대구 우동 89-1', '051-123-4567', 4.9, '["크루아상", "프렌치 베이커리", "테라스"]'),
(4, '달콤한 케이크 하우스', '대구 수성구 범어동 77', '053-987-6543', 4.7, '["케이크", "디저트", "무제한 리필 커피"]'),
(5, '옛날 찹쌀 도넛', '광주 북구 용봉동 25-3', '02-2345-6789', 4.5, '["찹쌀 도넛", "전통 베이커리", "할머니 손맛"]');

-- 3. 사용자가 찜한 빵집 데이터 삽입
INSERT INTO FavoriteBakery (user_id, bakery_id) VALUES
(1, 1),  -- 김철수가 '맛있는 빵집' 찜
(1, 2),  -- 김철수가 '고소한 베이커리' 찜
(2, 3),  -- 이영희가 '바삭한 크루아상' 찜
(2, 5),  -- 이영희가 '옛날 찹쌀 도넛' 찜
(3, 4),  -- John이 '달콤한 케이크 하우스' 찜
(4, 1),  -- Alice가 '맛있는 빵집' 찜
(4, 3),  -- Alice가 '바삭한 크루아상' 찜
(4, 5);  -- Alice가 '옛날 찹쌀 도넛' 찜

-- 4. 로그인 세션 데이터 삽입
INSERT INTO Login_Sessions (session_id, user_id, session_token, expires_at) VALUES
(1, 1, 'session_token_1', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(2, 2, 'session_token_2', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(3, 3, 'session_token_3', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(4, 4, 'session_token_4', DATE_ADD(NOW(), INTERVAL 1 DAY));