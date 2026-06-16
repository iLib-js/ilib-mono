export default function getLocaleData() {
    return {
        "root": {
            "address": {
                "region": "Province",
                "postalCode": "Post Code",
                "country": "Country",
                "locality": "City"
            },
            "datefmt": {
                "short": "MM/dd/yyyy",
                "medium": "MMM dd, yyyy",
                "long": "MMMM dd, yyyy"
            }
        },
        "en": {
            "address": {
                "postalCode": "Postal Code",
                "country": "Country",
                "locality": "Town"
            }
        },
        "en-AU": {
            "address": {
                "region": "State",
                "locality": "Township"
            }
        }
    };
};