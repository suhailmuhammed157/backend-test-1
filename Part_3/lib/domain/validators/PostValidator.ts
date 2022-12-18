import Joi from "joi";

export default Joi.object({
  title: Joi.string()
    .label("title")
    .min(5)
    .regex(/^[A-Za-z0-9 ]+$/)
    .max(50)
    .required(),

  description: Joi.string().label("description").max(500).required(),

  mainImage: Joi.string().label("main_image").email().required(),

  dateTime: Joi.string().label("date_time").required(),

  additionalImage: Joi.array()
    .items(Joi.string())
    .label("additional_images")
    .max(5)
    .optional(),
}).unknown();
