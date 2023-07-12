const express = require("express");
const router = express.Router();
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

// Function to extract Product Title
function get_title($) {
  try {
    const title = $("span#productTitle");
    const title_value = title.text();
    const title_string = title_value.trim();
    return title_string;
  } catch (error) {
    return "";
  }
}

// Function to extract Product Price
function get_price($) {
  try {
    const price = $("span.a-price span.a-offscreen").first().text().trim();
    return price;
  } catch (error) {
    try {
      const price = $("span#priceblock_ourprice").text().trim();
      return price;
    } catch (error) {
      return "";
    }
  }
}

// Function to extract Product Rating
function get_rating($) {
  try {
    const rating = $("i.a-icon.a-icon-star.a-star-4-5").first().text().trim();
    return rating;
  } catch (error) {
    try {
      const rating = $("span.a-icon-alt").text().trim();
      return rating;
    } catch (error) {
      return "";
    }
  }
}

// Function to extract Number of User Reviews
function get_review_count($) {
  try {
    const review_count = $("span#acrCustomerReviewText").first().text().trim();
    return review_count;
  } catch (error) {
    return "";
  }
}

// Function to extract Availability Status
function get_availability($) {
  try {
    const available = $("div#availability span").first.text().trim();
    return available;
  } catch (error) {
    return "Not Available";
  }
}

// Scrape route
router.get("/", (req, res) => {
  const url =
    "https://www.amazon.com/s?k=playstation+4&crid=1RSEO7IDJBE7H&sprefix=pla%2Caps%2C877&ref=nb_sb_ss_ts-doa-p_1_3"; // URL of the e-commerce website

  // Set headers to mimic a web browser
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  };

  // Fetch the HTML content of the website using axios
  axios
    .get(url, { headers })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      // Fetch links as List of Tag Objects
      const links = $("a.a-link-normal.s-no-outline");

      const products = [];
      const promises = [];

      links.each((index, element) => {
        const link = $(element).attr("href");

        const promise = axios
          .get(`https://www.amazon.com${link}`, { headers })
          .then((response) => {
            const productHtml = response.data;
            const product$ = cheerio.load(productHtml);

            const title = get_title(product$);
            const price = get_price(product$);
            const rating = get_rating(product$);
            const reviewCount = get_review_count(product$);
            const availability = get_availability(product$);
            const product = {
              title,
              price,
              rating,
              reviewCount,
              availability,
            };

            products.push(product);
          })
          .catch((error) => {
            console.log(error);
          });

        promises.push(promise);
      });
      console.log(promises);
      console.log(products);
      const csvWriter = createCsvWriter({
        path: "products.csv",
        header: [
          { id: "title", title: "Title" },
          { id: "price", title: "Price" },
          { id: "rating", title: "Rating" },
          { id: "reviewCount", title: "Review Count" },
          { id: "availability", title: "Availability" },
        ],
      });

      // Wait for all requests to finish
      Promise.all(promises)
        .then(() => {
          // Write data to CSV file
          csvWriter
            .writeRecords(products)
            .then(() => {
              console.log("CSV file created successfully");
              res.redirect("/");
            })
            .catch((error) => {
              console.log(error);
              res.status(500).send("An error occurred");
            });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("An error occurred");
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred");
    });
});

module.exports = router;
