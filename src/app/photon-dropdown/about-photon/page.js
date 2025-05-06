"use client"

import "./about-photon.css";

export default function AboutPhoton() {

    return (
        <>
            <h1>Photon is our Windows & Linux GUI application, powered by DejaVuAI®, supporting:</h1>

                <ul>
                    <li>* Image / Index Dataset Creation (images + EXIF data if present) + adding additional images to a dataset</li>
                    <li>* Video Dataset Creation (without needing to extract frames) + adding additional images to a dataset</li>
                    <li>* Image Searching - Internal, external, or captured image searching</li>
                    <li>* Video Searching - Internal or external (any type, resolution, or quality in all formats)</li>
                    <li>* Batch Searching - Internal or external (directory) searching</li>
                    <li>* Similarity group creation - internal or external source</li>
                    <li>* Visual comparison with automatic alignment and partial transparency</li>
                    <li>* Image registration (rotation angle, translation, shift, scale, mirror)</li>
                    <li>* Exporting search results (JSON or CSV)</li>
                    <li>* Saving / Loading previous search results</li>
                </ul>

                <p>Image search results:

                Confidence score (%); Multiple matches; Similarity Groups (reveals how groups of images are related to each other, with multiple levels of association); If present, EXIF Data, including GPS data and nearby geolocated images.</p>
        </>
    )
}



