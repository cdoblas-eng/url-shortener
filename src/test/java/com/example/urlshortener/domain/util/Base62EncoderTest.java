package com.example.urlshortener.domain.util;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class Base62EncoderTest {

    @Test
    void testEncodeAndDecode() {
        long id = 123456789L;
        String encoded = Base62Encoder.encode(id);
        long decoded = Base62Encoder.decode(encoded);

        assertEquals(id, decoded);
    }

    @Test
    void testZero() {
        assertEquals("0", Base62Encoder.encode(0));
        assertEquals(0, Base62Encoder.decode("0"));
    }
}
