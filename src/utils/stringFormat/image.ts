export const imageUrlFormat = (imageUrl : String) => {
    if (imageUrl) {
        const siteImageUrl = process.env.NEXT_PUBLIC_AWS_IMAGE_URL;
        return siteImageUrl + imageUrl
    } else {
        return "/images/tmp/profile/img_profile.png"
    }
}