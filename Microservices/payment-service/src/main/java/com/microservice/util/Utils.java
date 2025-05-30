package com.microservice.util;

import org.apache.commons.codec.binary.Hex;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class Utils {

    public static boolean verifySign(String payload, String expectedSign, String secret) throws Exception {
        String actualSign = calculateRFC2104HMAC(payload, secret);
        return actualSign.equals(expectedSign);
    }

    private static String calculateRFC2104HMAC(String data, String secret) throws Exception {
        SecretKeySpec signingKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(signingKey);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return new String(Hex.encodeHex(rawHmac));
    }
}
