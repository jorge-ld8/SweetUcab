import React, {useState, useEffect} from 'react';

export default function UploadImages({id}){
    const [images, setImages] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);

    useEffect(()=>{
        if (images.length < 1) return;
        const newImageUrls = [];
        images.forEach(image => newImageUrls.push(URL.createObjectURL(image)));
        setImageURLs(newImageUrls);
    }, [images]);

    function onImageChange(e){
        setImages([...e.target.files]);
    }

    return (
        <li>
            <input type={"file"} accept="image/*" id={id} name={id} onChange={onImageChange} multiple={true}/>
            {imageURLs.map(imageSrc=><img src={imageSrc}/>)}
        </li>
    )
}