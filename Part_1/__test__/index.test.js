const app = require("../index");
const request = require("supertest");
const { interpolators } = require("sharp");

describe("POST /post", () => {
  it("POST should return the sent post", async () => {
    const result = {
      data: {
        reference: "00003",
        title: "Title Tes",
        description: "Description Tes",
        date_time: 1679959960,
        main_image: "images/main_image_1_test.jpg",
        additional_images: ["images/additional_image_3_test.jpeg"],
      },
    };
    const response = await request(app)
      .post("/post")
      .attach("main_image", "./__test__/image/main_image_1_test.jpg")
      .attach(
        "additional_images",
        "./__test__/image/additional_image_3_test.jpeg"
      )
      .field({
        title: "Title Tes",
        description: "Description Tes",
        date_time: 1679959960,
      });
    expect(JSON.parse(response.text)).toEqual(result);
  });
  it("POST should fail adding a post", async () => {
    const response = await request(app)
      .post("/post")
      .attach("main_image", "./__test__/image/main_image_1_test.jpg")
      .attach(
        "additional_images",
        "./__test__/image/additional_image_3_test.jpeg"
      )
      .field({
        description: "Description Tes",
        date_time: 1679959960,
      });
    expect(response.statusCode).toBe(422);
  });
  it("it should fail adding a post and shows missing field error", async () => {
    const result = {
      error: "title is required",
    };
    const response = await request(app)
      .post("/post")
      .attach("main_image", "./__test__/image/main_image_1_test.jpg")
      .attach(
        "additional_images",
        "./__test__/image/additional_image_3_test.jpeg"
      )
      .field({
        description: "Description Test",
        date_time: 1679959960,
      });
    expect(JSON.parse(response.text)).toEqual(result);
  });
  it("it should return file too large error", async () => {
    const result = { error: "main_image File too large" };
    const response = await request(app)
      .post("/post")
      .attach("main_image", "./__test__/image/main_image.jpg")
      .attach(
        "additional_images",
        "./__test__/image/additional_image_3_test.jpeg"
      )
      .field({
        title: "test",
        description: "Description Tes",
        date_time: 1679959960,
      });
    expect(JSON.parse(response.text)).toEqual(result);
  });
  it("it should return title has special characters", async () => {
    const result = { error: "title contains special character" };
    const response = await request(app)
      .post("/post")
      .attach("main_image", "./__test__/image/main_image_1_test.jpg")
      .attach(
        "additional_images",
        "./__test__/image/additional_image_3_test.jpeg"
      )
      .field({
        title: "test!",
        description: "Description Tes",
        date_time: 1679959960,
      });
    expect(JSON.parse(response.text)).toEqual(result);
  });
  it("it should return not a unix value", async () => {
    const result = { error: "not unix time" };
    const response = await request(app)
      .post("/post")
      .attach("main_image", "./__test__/image/main_image_1_test.jpg")
      .attach(
        "additional_images",
        "./__test__/image/additional_image_3_test.jpeg"
      )
      .field({
        title: "test",
        description: "Description Tes",
        date_time: "1970-01-20T08:10:17.885Z",
      });
    expect(JSON.parse(response.text)).toEqual(result);
  });
});

describe("Add a blog post, get all blogs and check is the added post is present or not", () => {
  it("it should give a result of post is present in the blogs.json", async () => {
    const response = await request(app)
      .post("/post")
      .attach("main_image", "./__test__/image/main_image_1_test.jpg")
      .attach(
        "additional_images",
        "./__test__/image/additional_image_3_test.jpeg"
      )
      .field({
        title: "Title Tes",
        description: "Description Tes",
        date_time: 1679959960,
      });
    const getResponse = await request(app).get("/posts");
    const initialData = JSON.parse(response.text);
    const data = JSON.parse(getResponse.text);
    expect(data.at(-1).reference).toEqual(initialData.data.reference);
  });

  it("it should give a result of post is not present in the blogs.json", async () => {
    const initialBlogs = await request(app).get("/posts");
    const response = await request(app)
      .post("/post")
      .attach(
        "additional_images",
        "./__test__/image/additional_image_3_test.jpeg"
      )
      .field({
        title: "Title Tes",
        description: "Description Tes",
        date_time: 1679959960,
      });
    const finalBlogs = await request(app).get("/posts");
    const initialData = JSON.parse(initialBlogs.text);
    const finalData = JSON.parse(finalBlogs.text);
    console.log(initialData.length, finalData.length);
    expect(finalData.length).toBe(initialData.length);
  });
});

describe("test image APIs", () => {
  it("it should give a success message when accessing image", async () => {
    const response = await request(app).post("/image").send({
      imagePath: "image/additional_image_3_test.jpeg",
    });

    const token = JSON.parse(response.text).accessToken;

    console.log(token);

    const res = await request(app)
      .get("/images/additional_image_3_test.jpeg")
      .set("authorization", `Bearer ${token}`)
      .send({
        imagePath: "image/additional_image_3_test.jpeg",
      });

    expect(res.statusCode).toBe(200);
  });

  it("it should give an error message of imagePath is invalid", async () => {
    const result = { message: "invalid imagepath" };

    const response = await request(app).post("/image").send({
      imagePath: "image/additional_image_3_test.jpeg",
    });

    const token = JSON.parse(response.text).accessToken;

    console.log(token);

    const res = await request(app)
      .get("/images/additional_image_3_test.jpeg")
      .set("authorization", `Bearer ${token}`)
      .send({
        imagePath: "image/additional_image_3_tes.jpeg",
      });

    expect(JSON.parse(res.text)).toEqual(result);
  });
});
