import { Component } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';

@Component({
	selector: 'app-development-api-response',
	imports: [Highlight],
	templateUrl: './development-api-response.html',
	styleUrl: './development-api-response.scss',
})
export class DevelopmentApiResponse {
	standard_res = `{
	"status": number,
	"success": boolean,
	"message": string,
	"data": object | array | null
}
`;


	login_req = `URL: /api/auth/login
Method: POST
Request Body:
	{
		"email": "prakashpt007@gmail.com"
	}`;

	login_suc_res = `Response:
		{
			"status": 200,
			"success": true,
			"message": "OTP has been sent to your registered email address.",
			"data": {
				"otp_requested_at": "2025-12-31T09:15:30+05:30",
				"otp_expires_at": "2025-12-31T09:20:30+05:30",
				"otp_validity_seconds": 300
			}
		}
`;

	login_failed_res_1 = `Response:
	{
		"status": 404,
		"success": false,
		"message": "No account found with this email address. Please register to continue.",
		"data": null
	}
`;


	otp_verify_req = `URL: /api/auth/verify-otp
Method: POST
Request Body :
	{
		"email": "prakashpt007@gmail.com",
		"otp": "123456"
	}
`;

	otp_verify_suc_res = `Response:
{
	"status": 200,
	"success": true,
	"message": "OTP verified successfully.",
	"data": {
		"access_token": "eyJhbGciOiJIUzI1NiIsInR5...",
	}
}
`;


	access_token = `{  "typ": "JWT",  "alg": "HS256" }`;

	access_token_decoded = `
	{
		"user_id" : number,									// 123456
		"user_name" : string,								// Prakash Patil
		"email" : string,										// abc@gmail.com
		"phone" : string, 									// 8421460991
		"is_first_login" : boolean, 				// true, false
		"has_updated_password" : boolean, 	// true, false
		"status" : string, 									// 'active','inactive','deleted'
	}
`;


	invalid_otp = `Response:
{
	"status": 400,
	"success": false,
	"message": "Invalid OTP. Please try again.",
	"data": null
}
`;

	otp_expired = `Response:
{
	"status": 410,
	"success": false,
	"message": "OTP has expired. Please request a new OTP.",
	"data": null
}
`;


	register_user_req = `URL: /api/auth/register-user
Method: POST
Request Body :
	{
		"name" : "Prakash Patil",
		"email" : "prakashpt007@gmail.com",
		"phone" : "8421460991",
		"dob" : "1992-09-10"
	}
`;

	user_register_res_suc = `Response :
	{
		"status": 201,
		"success": true,
		"message": "User registered successfully.",
		"data": null
	}
`;

	user_already_reg_res = `Response :
	{
		"status": 200,
		"success": false,
		"message": "User already registered. Please log in using your email address.",
		"data": null
	}
`;

	validation_err_res = `Response :
	{
		"status": 400,
		"success": false,
		"message": "Validation failed.",
		"data": {
			"errors": {
				"email" : "Invalid email format.",
				"phone" : "Phone number must be 10 digits."
			}
		}
	}
`;


	our_featured_list_res = `URL: /api/our-featured-list

Method: POST

Request Header : {
	Authorization: Bearer access_token,
}

Request Body :
	{
		"city" : "pune",					// If user add their location.
	}

	OR

	{
		"city" : "",							// If user NOT added their location.
	}

Response: 
{
	"status" : 200,
	"success" : true,
	"message" : "Success",
	"data" : [
		{
			"id": 1,
			"name" : "Tandoori Roti",
			"image_url" : "assets/images/items/item-2.jpg",
			"description" : "A soft, slightly chewy Indian flatbread...",
			"food_class" : "VEG",
			"address" : "Nagpur - 440034",
			"base_price" : 50,
			"rating" : 4.4
		},
		....
	]
}`;


	regional_cuisines_list_res = `URL: /api/regional-cuisine-list
Method: GET
Response: 
{
	"status" : 200,
	"success" : true,
	"message" : "Success",
	"data" : [
		{
			"id": 1,
			"image": "assets/images/items/item-1.jpg",
			"name": "Punjabi"
		},
		{
			"id": 2,
			"image": "assets/images/items/item-2.jpg",
			"name": "Rajasthani"
		},
		....
	]
}`;

	international_cuisines_list_res = `URL: /api/international-cuisine-list
Method: GET
Response: 
{
	"status" : 200,
	"success" : true,
	"message" : "Success",
	"data" : [
		{
			"id": 1,
			"image": "assets/images/items/item-1.jpg",
			"name": "Italian"
		},
		{
			"id": 2,
			"image": "assets/images/items/item-2.jpg",
			"name": "Chinese"
		},
		....
	]
}`;

	special_cuisines_list_res = `URL: /api/special-cuisine-list
Method: GET
Response: 
{
	"status" : 200,
	"success" : true,
	"message" : "Success",
	"data" : [
		{
			"id": 1,
			"image": "assets/images/items/item-1.jpg",
			"name": "Street Food"
		},
		{
			"id": 2,
			"image": "assets/images/items/item-2.jpg",
			"name": "Biryani Specials"
		},
		....
	]
}`;



	recommendation_list_res = `URL: /api/recommendation-list
Method: POST

Request Header : {
	Authorization: Bearer access_token,
}

Request Body :
	{
		"city" : "pune",					// If user add their location.
	}

	OR

	{
		"city" : "",							// If user NOT added their location.
	}

Response: 
{
	"status" : 200,
	"success" : true,
	"message" : "Success",
	"data" : [
		{
			"id": 1,
			"name" : "Tandoori Roti",
			"image_url" : "assets/images/items/item-2.jpg",
			"description" : "A soft, slightly chewy Indian flatbread...",
			"food_class" : "VEG",
			"address" : "Nagpur - 440034",
			"base_price" : 50,
			"rating" : 4.4
		},
		....
	]
}`;



	cloud_kitchen_location_list_api = `URL: /api/locations?search=pun
Method: GET

Response: 
{
  "status": 200,
  "success": true,
  "message": "Success",
  "data": [
    {    
			"city": "Pune"
			"pincode": "411032"
			"state": "Maharashtra"
    },
    {
			"city": "Pune"
			"pincode": "411030"
			"state": "Maharashtra"
    }
  ]
}
`;

}