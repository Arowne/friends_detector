<template>
	<Page class="page">
        <ListView for="item in listOfItems" @itemTap="onItemTap">
            <v-template>

                <FlexboxLayout flexDirection="column">
                    <FlexboxLayout justifyContent="center"  class="text-center">
                        <Label :text="item.name"  height="50" class="text-center" id="contactName"/>
                    </FlexboxLayout>
                    <FlexboxLayout justifyContent="center" class="text-center"  >
                        <Label :text="item.phone_number"  height="50" class="text-center"/>
                    </FlexboxLayout>
                    <FlexboxLayout justifyContent="center" class="m-5">
                        <Button text="CALL" @tap="onCall(item.phone_number)" left="10" width="100"  height="50" class="btn-rounded m-5" id="btnCall"/>
                        <Button text="SMS" @tap="onSMS(item.phone_number)" left="10" width="100" height="50" class="btn-rounded m-5" id="btnSMS"/>
                        <Button text="I AM HERE" @tap="iamHere(item.phone_number)" left="10" width="100" height="50" class="btn-rounded m-5"  id="btnIamHere"/>
                    </FlexboxLayout>
                </FlexboxLayout>
            </v-template>
        </ListView>
    </Page>
</template>


<script>
import * as http from "http";
import { Image } from "tns-core-modules/ui/image"
import { getFrameById, topmost } from "tns-core-modules/ui/frame";
import { observe } from 'tns-core-modules/ui/gestures/gestures';
import dialog from 'tns-core-modules/ui/dialogs';
import permissions from "nativescript-permissions"
import { error } from 'tns-core-modules/trace/trace';
import { Location, getCurrentLocation, isEnabled, distance, enableLocationRequest } from "nativescript-geolocation";

export default {
    props: ['allContact'],
    methods: {
        onCall(number) {
            
            this.phone.dial(number, '');

        },
        onSMS(number) {

            this.phone.sms(number);

        },
        iamHere(number) {

            var axios = require( "axios" );

            enableLocationRequest(true);

            getCurrentLocation({
                timeout: 5000
            })
            .then(location => {
                this.startpointLatitude = location.latitude;
                this.startpointLongitude = location.longitude;

                axios.get("https://api-adresse.data.gouv.fr/reverse/?lat="+location.latitude+"&"+"lon="+location.longitude)
                .then( (response) => {

                    var fullAdress = response.data.features[0].properties.label;
                    this.phone.sms(number, "Rejoins moi à cette adresse :" + fullAdress);

                })
                .catch(function (error) {
                    console.log(error);
                });

            }).catch(error => {
                    console.log("Location error received: " + error);
                    alert("Location error received: " + error);
            });
            


        }
    },
    mounted () {
        console.log(this.$props.allContact);
    },
    data() {
        return {
            textPicture: "Register",
            listOfItems: this.$props.allContact,
            phone: require( "nativescript-phone" )
        };
    },
};
</script>
<style scoped>

.btn-rounded {
    border-radius: 50%;
}

#btnCall {
    color: white;
    background-color: green;
}

#btnSMS {
    color: white;
    background-color: #cd853f;
}

#btnIamHere {
    color: white;
    background-color: deepskyblue;
}
#contactName {
    font-size: 30px;
}
.page{
    background-color: white;
    z-index: 1000;
}

#stack {
    background-color: white;

}
</style>