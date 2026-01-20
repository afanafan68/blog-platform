package com.example.Enum;

public enum statusEnum {
    ENABLE("正常", 1),
    DISABLE("禁用", 0);

    private String msg;
    private Integer code;

    statusEnum(String msg, Integer code) {
        this.code = code;
        this.msg = msg;
    }


    public String getMsg() {
        return msg;
    }

    public Integer getCode() {
        return code;
    }
}
