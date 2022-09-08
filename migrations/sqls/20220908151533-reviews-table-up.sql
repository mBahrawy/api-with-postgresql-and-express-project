CREATE TABLE reviews (
    id SERIAL PRIMARY KEY REFERENCES orders(id),
    service_rating FLOAT CHECK (service_rating >= 0 AND service_rating <= 5),
    feedback text
)