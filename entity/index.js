const sequelize = require('sequelize');
const sequelizeInstance = require('./instance');

const user = sequelizeInstance.define('user', {
    userid: { type: sequelize.STRING(200), allowNull: false }, // 아이디
    password: { type: sequelize.STRING(255), allowNull: false }, // 패스워드
    username: { type: sequelize.STRING(30), allowNull: false }, // 사용자명
},
{
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
});

const auth = sequelizeInstance.define('auth', {
    authid: { type: sequelize.STRING(200), allowNull: false }, // 마스터 아이디
    password: { type: sequelize.STRING(255), allowNull: false }, // 패스워드
    authname: { type: sequelize.STRING(30), allowNull: false }, // 마스터명
},
{
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
});

const display = sequelizeInstance.define('display', {
    branch: { type: sequelize.STRING(30), allowNull: false }, // 지점명
    brand: { type: sequelize.STRING(30), allowNull: false }, // 브랜드
    location: { type: sequelize.STRING(255), allowNull: true }, // 위치
    imagePath: { type: sequelize.STRING(400), allowNull: true }, // 등록된 봇 이미지의 경로 (업데이트, 삭제 시 필요)
    imageUrl: { type: sequelize.STRING(500), allowNull: true }, // 등록된 이미지를 나타내 줄 url
},
{
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
});

const item = sequelizeInstance.define('item', {
    modelNumber: { type: sequelize.STRING(50), allowNull: false }, // 상품 고유 번호
    category: { type: sequelize.STRING(30), allowNull: false }, // 분류
    price: { type: sequelize.INTEGER, allowNull: false }, // 정가
    name: { type: sequelize.STRING(50), allowNull: false }, // 상품명
    discountPrice: { type: sequelize.INTEGER, allowNull: true }, // 할인가
    brandId: { type: sequelize.INTEGER, allowNull: true }, // 판매 브랜드
    amount: { type: sequelize.INTEGER, allowNull: false, defaultValue: 0 }, // 수량
    information: { type: sequelize.JSON, allowNull: true }, // 상품 정보 (색상, 사이즈 등)
    imagePath: { type: sequelize.STRING(400), allowNull: true }, // 등록된 봇 이미지의 경로 (업데이트, 삭제 시 필요)
    imageUrl: { type: sequelize.STRING(500), allowNull: true }, // 등록된 이미지를 나타내 줄 url
},
{
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
});

module.exports = {
    user,
    display,
    item,
    auth
};
