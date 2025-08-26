export const profileImageUrlFormat = (imageUrl : String) => {
    if (imageUrl) {
        const siteImageUrl = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;
        return siteImageUrl + imageUrl
    } else {
        return "/images/common/profile.png"
    }
}