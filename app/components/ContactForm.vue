<template>
	<Page class="page">

        <StackLayout @loaded="stackLoaded" id="stack">

            <Button text="Back" @tap="$navigateTo(cameraPage)" :key="buttonKey" width="100%" class="btn btn-primary btn-active far" id="btnBack"/>

            <TextField hint="Contact name" 
            :text="$props.contactName"
            secure="false"
            returnKeyType="done" 
            autocorrect="false"
            maxLength="10"
            id="contactName"
            class="input input-border"></TextField>

            <TextField hint="Phone number" 
                secure="false"
                keyboardType="datetime"
                returnKeyType="done" 
                autocorrect="false"
                maxLength="10"
                id="phoneNumber"
                :text="textFieldValue"
                class="input input-border"></TextField>

            <Button :text="textPicture" @tap="onTap" :key="buttonKey" width="100%" class="btn btn-primary btn-active far" id="btn"/>
        </StackLayout>
    </Page>
</template>


<script>
import * as http from "http";
import { Image } from "tns-core-modules/ui/image"
import { getFrameById, topmost } from "tns-core-modules/ui/frame";
import { observe } from 'tns-core-modules/ui/gestures/gestures';
import dialog from 'tns-core-modules/ui/dialogs';
import { isString } from 'util';
import { CameraPlus } from '@nstudio/nativescript-camera-plus';
import contacts from "nativescript-contacts"
import permissions from "nativescript-permissions"
import { error } from 'tns-core-modules/trace/trace';
import Camera from '../components/Camera';


export default {
    props: ['contactName'],
    methods: {
        onTap(args) {

            var phone = require( "nativescript-phone" );

            var phoneNumber = args.object.page.getViewById("phoneNumber");
            var contactName = args.object.page.getViewById("contactName");
            const axios = require('axios');

            axios.get('http://192.168.43.5:8000/add_contact?name=' + contactName.text + '&number=' + phoneNumber.text)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

            phone.sms(phoneNumber.text, "Salut c'est Aaron !");   

        }
    },
    data() {
        return {
            textPicture: "Register",
            textFieldValue: "",
            cameraPage: Camera
        };
    },
};
</script>
<style scoped>

.page{
    z-index: 1000;
}

#stack {
    background-color: white;
}

#btnBack {
    border-radius: 50%;
}

</style>