const Joi = require("joi");
const moment = require("moment");
const schemas = {
  blogPOST: Joi.object().keys({
    title: Joi.string()
      .min(5)
      .max(50)
      .regex(/^[A-Za-z0-9 ]+$/)
      .required(),
    description: Joi.string().max(500).required(),
    main_image: Joi.string().required(),
    additional_images: Joi.array().items(Joi.string()).max(5),
    date_time: Joi.date()
      .timestamp("unix")
      .greater(Math.floor(Date.now()))
      .required(),
  }),
};
module.exports = schemas;
