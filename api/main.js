"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/api/test', (req, res) => {
    res.json({ message: 'test' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
