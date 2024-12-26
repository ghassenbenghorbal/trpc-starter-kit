let origins = {
    origin: "*" as string[] | string,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
};

if (process.env.NODE_ENV === "production") {
    origins.origin = ["https://" + process.env.ORIGIN, "http://localhost:3000"];
} 
else {
    origins.origin = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ];
}

export default origins;
