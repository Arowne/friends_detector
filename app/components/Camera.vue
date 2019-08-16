<template>
	<Page class="page">
        <StackLayout @loaded="getContact" id="stack">
            <CameraPlus id="camerPlus" debug="false" height='100%' defaultCamera="rear" showFlashIcon="false" galleryPickerMode="single" confirmPhotos="false" saveToGallery="true" @tap="tapMethod">
                <Button text="Contact" @tap="$navigateTo(contactList, {props: {allContact: allContact}})" :key="buttonKey" width="50%" class="btn btn-primary btn-active far" id="btnContact"/>                
            </CameraPlus>
            <Button :text="textPicture" @tap="onTap" :key="buttonKey" width="100%" class="btn btn-active far" id="btn"/>
            <Button text='Next' @tap="$navigateTo(contactForm, {props: {contactName: personName}})" width="100%" visibility="collapsed" class="btn  btn-active far" id="btnNavigate"/>
        </StackLayout>
    </Page>
</template>


<script>
import * as http from "http";
import plugin from "nativescript-screenshot";
import { Image } from "tns-core-modules/ui/image"
import { getFrameById, topmost } from "tns-core-modules/ui/frame";
import { observe } from 'tns-core-modules/ui/gestures/gestures';
import dialog from 'tns-core-modules/ui/dialogs';
import axios from "axios";
import { ImageSource } from 'tns-core-modules/image-source/image-source';
import { isString } from 'util';
import { CameraPlus } from '@nstudio/nativescript-camera-plus';
import { TNSTextToSpeech, SpeakOptions } from 'nativescript-texttospeech';
import { SpeechRecognition } from "nativescript-speech-recognition";
import audio from 'nativescript-audio';
import ContactForm from '../components/ContactForm';
import ContactList from '../components/ContactList';

export default {
    methods: {
        onTap(args) {

            const that = this;

            var plugs = require('@nstudio/nativescript-camera-plus').CameraPlus;
            this.textPicture = "J'essai de vous reconnaitre ...";
            var camera = args.object.page.getViewById("camerPlus");
            var btn = args.object.page.getViewById("btn");
            var btnNavigate = args.object.page.getViewById("btnNavigate");

            camera.takePicture({ saveToGallery: false, confirm: false, keepAspectRatio: true, width: 1920, height: 1440 });

            camera.on(plugs.photoCapturedEvent, function(args) {
                
                var bghttp = require("nativescript-background-http");
                var session = bghttp.session("image-upload");

                var file = args.data.android;

                var request = {
                        url: "http://192.168.43.5:8000/register",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/octet-stream",
                            "File-Name": "image.jpg"
                        },
                        description: "Uploading"
                    };

                var params = [
                    { name: "test", value: "value" },
                    { name: "image", filename: file, mimeType: "image/jpeg" }
                ];

                var task = session.multipartUpload(params, request);   

                task.on("progress", (response) => {
                    console.log(response)
                });
                
                task.on("responded", (response) => {

                        var getResponse = JSON.parse(response.data);

                        if(getResponse.gratings){
                            that.personName = getResponse.person;
                            btn.visibility = "collapse";
                            btnNavigate.visibility = "visible";
                        }
                        else {
                            that.textPicture = "RESTART"
                        }
                        console.log(getResponse);
                    });

            })
        },
        getContact(args) {
            const axios = require('axios');

            axios.get('http://192.168.43.5:8000/all_contact')
            .then( (response) => {
                this.allContact = response.data.response;
            })
            .catch( (error)  => {
                console.log(error);
            });

        }
    },
    created () {
        const axios = require('axios');

        axios.get('http://192.168.43.5:8000/all_contact')
            .then( (response) => {
                this.allContact = response.data.all_contact;
                console.log(response.data.all_contact)
            })
            .catch( (error)  => {
                console.log(error);
            });

    },
    data() {
        return {
            pictureFromCamera: null,
            textPicture: "Add me !",
            buttonKey: 0,
            imageKey: 0,
            image: null,
            stackLayout: null,
            img_src: "",
            imageStyle: "",
            limit: 0,
            stop: false,
            faceIdentification: "",
            contactForm: ContactForm,
            contactList: ContactList,
            personName: "",
            allContact: null
        };
    },
};
</script>
<style scoped>

#btn{
    background: green;    
    margin: 0;
    border-radius: 50%;
    width: 10%!important;
    z-index: 1000;
    margin-top: -100px;
    color: white;
}

#btnNavigate{
    background: green;
    margin: 0;
    border-radius: 50%;
    width: 10%!important;
    z-index: 1000;
    margin-top: -100px;
    color: white;
}

#btnContact {
    border-radius: 50%;
}

</style>