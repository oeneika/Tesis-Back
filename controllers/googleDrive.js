const {google} = require("googleapis");
const path = require("path");
const fs = require("fs");

const CLIENT_ID =
	"1082706641695-p610jaihg5vqusbvfas4p5scik740si4.apps.googleusercontent.com";
const CLIENT_SECRET = "2HoJ7r78nXIc5nDF5CsQ1SfJ";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
	"1//0474Nou0N_uyMCgYIARAAGAQSNwF-L9IrLLjbHLkyV2rPc78juLKbHtG7cAhD7RJ0e9BjZXeqJ7a8QhOZSyhKSLURNFxMeAedfMI";

const oauth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
	version: "v3",
	auth: oauth2Client,
});

const filePath = path.join("./uploads/users", "Ae7f4o_FNzrex2HR7QJqayEr.jpg");

async function uploadFile() {
	try {
		const response = await drive.files.create({
			requestBody: {
				name: "beautifulgirl.jpg",
				mimeType: "image/jpeg",
			},
			media: {
				mimeType: "image/jpg",
				body: fs.createReadStream(filePath),
			},
		});
		console.log(response.data);
		/*
        {
            kind: 'drive#file',
            id: '1XLbIE4mpoWuMOxax8RQguUwRFPFnibOn',
            name: 'beautifulgirl.jpg',
            mimeType: 'image/jpeg'
        } */
	} catch (error) {
		console.log(error.message);
	}
}

async function deleteFile() {
	try {
		//Hay que preguntar donde almacenamos esto
		const response = await drive.files.delete({
			fileId: "1Pgb1UsPyXqf1P4V1h5a8piXrNP52hHwM",
		});
		console.log(response.data, response.status);
		//204 success
	} catch (error) {
		console.log(error.message);
	}
}

async function generatePublicUrl() {
	try {
		const fileId = "1XLbIE4mpoWuMOxax8RQguUwRFPFnibOn";
		await drive.permissions.create({
			fileId: fileId,
			requestBody: {
				role: "reader",
				type: "anyone",
			},
		});

		const result = await drive.files.get({
			fileId: fileId,
			fields: "webViewLink, webContentLink",
		});

		console.log(result.data);
		/* webContentLink es para descargar el archivo y webViewLink para ver el archivo
        {
            webContentLink: 'https://drive.google.com/uc?id=1XLbIE4mpoWuMOxax8RQguUwRFPFnibOn&export=download',
            webViewLink: 'https://drive.google.com/file/d/1XLbIE4mpoWuMOxax8RQguUwRFPFnibOn/view?usp=drivesdk'
        }
        */
	} catch (error) {
		console.log(error.message);
	}
}
module.exports = {
	uploadFile,
	deleteFile,
	generatePublicUrl,
};
