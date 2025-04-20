
export default async function getCroppedImg(originalImageUrl, cropPosition) {
    return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous'; // Set this if the image URL is from a different domain
        image.src = originalImageUrl;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = cropPosition.width;
            canvas.height = cropPosition.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(
                image,
                cropPosition.x,
                cropPosition.y,
                cropPosition.width,
                cropPosition.height,
                0,
                0,
                cropPosition.width,
                cropPosition.height
            );

            canvas.toBlob((blob) => {
                const croppedImageUrl = URL.createObjectURL(blob);
                const file = new File([blob], "image.png", { type: "image/png" });
                resolve(file);
            }, 'image/jpeg');
        };
    });
}