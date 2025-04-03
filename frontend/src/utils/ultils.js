import { format } from "date-fns";
import CryptoJS from "crypto-js";

const SECRET_KEY = "1005";
export const LOCATIONIQ = "pk.faf3d66fd55714f726b3656386e724e2" 
const isLeapYear = (year) => {
    if(+year % 400 === 0 || (+year % 4 === 0 && +year % 100 !== 0)){
        return true;
    }
    return false;
}

export const isValidDate = (day , month, year) => {
    let isValidDate = true;

    if(day <= 0 || month <= 0 || month > 12 || year <= 0){
        return false;
    }
    if(+month === 1 || +month === 3 || +month === 5 || +month === 7 || +month === 8 || +month === 10 || +month === 12){
        if( day > 31){
            isValidDate = false;
        }
    }
    else if(+month === 4 || +month === 6 || +month === 9 || +month === 11){
        if( day > 30){
            isValidDate = false;
        }
    }else{
        if(isLeapYear(year)){
            isValidDate = day > 29 ? false : isValidDate;
        }else{
            isValidDate = day > 28 ? false : isValidDate;
        }
    }

    return isValidDate;
}

export const isValidPhoneNum = (phone) => {
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return phone.match(regexPhoneNumber) ? true : false;
}

export const  isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const formatToVNDate = (date) => {
    if(date){
        return format(new Date(date), "dd/MM/yyyy, HH:mm:ss")
    }
}

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

export const encryptData = (data) => {
    if (data) {
        return CryptoJS.Rabbit.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    }
    return null;
};

export const decryptData = (data) => {
    if (data) {
        const bytes = CryptoJS.Rabbit.decrypt(data, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return null;
};