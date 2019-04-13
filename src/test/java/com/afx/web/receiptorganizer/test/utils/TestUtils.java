package com.afx.web.receiptorganizer.test.utils;

import org.springframework.http.MediaType;

import java.nio.charset.Charset;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class TestUtils {

    public static final MediaType APPLICATION_JSON_UTF8 = new MediaType(MediaType.APPLICATION_JSON.getType(),
            MediaType.APPLICATION_JSON.getSubtype(),
            Charset.forName("utf8")
    );

    public static String serialize(Object object) {
        String objectJson = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
            objectJson = mapper.writeValueAsString(object);
        } catch(JsonProcessingException jsonEx) {
            objectJson = "";
        }

        return objectJson;
    }
}
