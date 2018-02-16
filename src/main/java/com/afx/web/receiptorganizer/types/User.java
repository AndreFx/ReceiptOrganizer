package com.afx.web.receiptorganizer.types;

import org.springframework.web.multipart.MultipartFile;

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
    private MultipartFile image;
    private byte[] userPhotoImage;
    private byte[] userPhotoThumbnail;

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

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }

    public byte[] getUserPhotoImage() {
        return userPhotoImage;
    }

    public void setUserPhotoImage(byte[] userPhotoImage) {
        this.userPhotoImage = userPhotoImage;
    }

}
