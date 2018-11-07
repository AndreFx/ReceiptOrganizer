package com.afx.web.receiptorganizer.dao.model.user;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

public class User implements Serializable {

    /*
    Private Fields
     */

    @Size(max = 50, message = "First name must be under 50 characters")
    private String fName;

    @Size(max = 50, message = "Last name must be under 50 characters")
    private String lName;

    @NotNull
    @Min(value=5, message = "Page size must be between 5 and 25")
    @Max(value=25, message = "Page size must be between 5 and 25")
    private Integer paginationSize;
    private String username;
    private byte[] userPhoto;
    private String userPhotoFileName;
    private String userPhotoMIME;
    private byte[] userPhotoThumbnail;
    private String userPhotoThumbnailMIME;

    /*
    Getters and setters
     */

    public byte[] getUserPhotoThumbnail() {
        return userPhotoThumbnail;
    }

    public void setUserPhotoThumbnail(byte[] userPhotoThumbnail) {
        this.userPhotoThumbnail = userPhotoThumbnail;
    }

    public String getUsername() {
	    return this.username;
    }

    public void setUsername(String username) {
	this.username = username;
    }

    public String getfName() {
        return fName;
    }

    public void setfName(String fName) {
        this.fName = fName;
    }

    public String getlName() {
        return lName;
    }

    public void setlName(String lName) {
        this.lName = lName;
    }

    public Integer getPaginationSize() {
        return paginationSize;
    }

    public void setPaginationSize(Integer paginationSize) {
        this.paginationSize = paginationSize;
    }

    public String getUserPhotoMIME() {
        return userPhotoMIME;
    }

    public void setUserPhotoMIME(String userPhotoMIME) {
        this.userPhotoMIME = userPhotoMIME;
    }

    public byte[] getUserPhoto() {
        return userPhoto;
    }

    public void setUserPhoto(byte[] userPhoto) {
        this.userPhoto = userPhoto;
    }

    public String getUserPhotoFileName() {
        return userPhotoFileName;
    }

    public void setUserPhotoFileName(String userPhotoFileName) {
        this.userPhotoFileName = userPhotoFileName;
    }

    public String getUserPhotoThumbnailMIME() {
        return userPhotoThumbnailMIME;
    }

    public void setUserPhotoThumbnailMIME(String userPhotoThumbnailMIME) {
        this.userPhotoThumbnailMIME = userPhotoThumbnailMIME;
    }
}
