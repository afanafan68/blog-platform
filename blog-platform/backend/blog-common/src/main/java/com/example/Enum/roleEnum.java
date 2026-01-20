package com.example.Enum;

public enum roleEnum {
    ADMIN("管理员", 0),
    USER("普通用户", 1);

    private String msg;
    private Integer code;

    roleEnum(String msg, Integer code) {
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
