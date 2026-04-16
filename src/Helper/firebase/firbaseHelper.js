import firebase from "./firebaseConfig"
import * as directory from "./firbaseDirectory"
import { v4 as uuidv4 } from "uuid"
//import StoreHelper from '../storeHelper'

const helpers = {
    getCollection: function (path) {
        return firebase.firestore().collection(path);
    },
    getProductCollection: function () {
        const path = directory.product
        return this.getCollection(path);
    },
    pushProductCollection: function () {
        const path = directory.product
        const ref = this.getCollection(path);
        var data = {};
        data.name = "Product 1"
        data.description = "Product 1"
        data.category = "Cat 1"
        data.id = uuidv4();


        ref.doc(data.id)
            .set(data)
            .catch((err) => {
                console.error(err);
            })

    },
    createOrder: function (formData) {
        const path = directory.order;
        const ref = this.getCollection(path);
        ref.doc(formData.ref_uuid)
            .set(formData)
            .catch((err) => {
                console.error(err);
            })
    }
}

export default helpers;