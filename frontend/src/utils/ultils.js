import { format } from "date-fns";

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

export const formatToVNDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy, h:mm:ss");
}