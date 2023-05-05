import { body } from "express-validator";

export const postValidation = [
  body("title", "Введите название статьи").isLength({ min: 2 }).isString(),
  body("text", "Введите текст статьи").isLength({ min: 20 }).isString(),
  body("tags", "Неверный формать тэгов(должен быть массив)")
    .optional()
    .isString(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
