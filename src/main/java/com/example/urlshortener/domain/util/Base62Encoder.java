package com.example.urlshortener.domain.util;

public class Base62Encoder {

    private static final String BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int BASE = BASE62.length();

    private Base62Encoder() {
        // Utility class
    }

    public static String encode(long number) {
        if (number <= 0) {
            return "0";
        }
        StringBuilder sb = new StringBuilder();
        while (number > 0) {
            sb.append(BASE62.charAt((int) (number % BASE)));
            number /= BASE;
        }
        return sb.reverse().toString();
    }

    public static long decode(String str) {
        long num = 0;
        for (int i = 0; i < str.length(); i++) {
            num = num * BASE + BASE62.indexOf(str.charAt(i));
        }
        return num;
    }
}
