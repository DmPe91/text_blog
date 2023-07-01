import { body } from "express-validator";

export const registerValidator = [
  body("email", "Укажите правильный формат электронной почты").isEmail(),
  body("password", "Пароль должен содержать минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Укажите имя").isLength({ min: 2 }),
  body("avatarUrl", "Неверная ссылка на аватар").optional().isString(),
];
export const loginValidation = [
  body("email", "Укажите правильный формат электронной почты").isEmail(),
  body("password", "Пароль должен содержать минимум 5 символов").isLength({
    min: 5,
  }),
];
