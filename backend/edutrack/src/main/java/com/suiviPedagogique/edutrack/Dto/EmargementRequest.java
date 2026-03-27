package com.suiviPedagogique.edutrack.Dto;

import lombok.Data;

@Data
public class EmargementRequest {
    private String tokenQRCode;
    private String latitudeGPS;
    private String longitudeGPS;
}
