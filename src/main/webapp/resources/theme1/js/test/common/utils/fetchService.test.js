import fetchService from "../../../common/utils/fetchService";
import * as constants from "../../../common/constants";

const webContext = "/ReceiptOrganizer";

describe("fetchService", function() {
  describe("encodeURLParams", function() {
    it("should encode an array to a url param", function() {
      let url = new URL(constants.HOST_URL + webContext);
      const params = {
        myarray: ["something", "somethingelse"]
      };

      url = fetchService.encodeURLParams(url, params);

      expect(url.href).toBe(
        constants.HOST_URL + webContext + "?myarray=something%2Csomethingelse"
      );
    });

    it("should not encode an empty array to a url param", function() {
      let url = new URL(constants.HOST_URL + webContext);
      const params = {
        myarray: []
      };

      url = fetchService.encodeURLParams(url, params);

      expect(url.href).toBe(constants.HOST_URL + webContext);
    });

    it("should encode a number to a url param", function() {
      let url = new URL(constants.HOST_URL + webContext);
      const params = {
        myNum: 12
      };

      url = fetchService.encodeURLParams(url, params);

      expect(url.href).toBe(constants.HOST_URL + webContext + "?myNum=12");
    });

    it("should encode a complex param object (array and strings) to a url param", function() {
      let url = new URL(constants.HOST_URL + webContext);
      const params = {
        string: "MyString",
        array: ["Test", "Other", "Tester"]
      };

      url = fetchService.encodeURLParams(url, params);

      expect(url.href).toBe(
        constants.HOST_URL +
          webContext +
          "?string=MyString&array=Test%2COther%2CTester"
      );
    });

    it("should encode a complex param object (array, numbers, and strings) to a url param", function() {
      let url = new URL(constants.HOST_URL + webContext);
      const params = {
        string: "MyString",
        array: ["Test", "Other", "Tester"],
        pageNum: 12
      };

      url = fetchService.encodeURLParams(url, params);

      expect(url.href).toBe(
        constants.HOST_URL +
          webContext +
          "?string=MyString&array=Test%2COther%2CTester&pageNum=12"
      );
    });

    it("should not encode any params on an empty object", function() {
      let url = new URL(constants.HOST_URL + webContext);
      const params = {};

      url = fetchService.encodeURLParams(url, params);

      expect(url.href).toBe(constants.HOST_URL + webContext);
    });
  });
});
