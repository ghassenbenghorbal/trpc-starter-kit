declare namespace NodeJS {
	interface ProcessEnv {
		SECRET_KEY: string;
		PORT?: string;
		NODE_ENV: "development" | "production";
		
		DB_HOST: string;
		DB_USER: string;
		DB_PASSWORD: string;
		DB_NAME: string;
		DB_PORT: string;
		DB_URL: string;

		UPLOADTHING_SECRET: string;
		UPLOADTHING_APP_ID: string;
	}
}