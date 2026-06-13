package com.suiviPedagogique.edutrack.Dto;

import lombok.Data;

@Data
public class EmargementRequest {
    private String tokenQRCode;
    private Float latitude;
    private Float longitude;
    private String adresseApproximative;
}
