import axios, { AxiosResponse } from 'axios';

const usersBaseUrl = "http://localhost:7000/api/v1/users";

async function createUser(payload: any) {
    return await axios.post(usersBaseUrl, payload, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function deleteUser(userId: string) {
    return axios.delete(`${usersBaseUrl}/${userId}`);
}

async function createProfile(userId: string) {
    return await axios.post(`${usersBaseUrl}/${userId}/profile`, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function getProfile(userId: string) {
    return axios.get(`${usersBaseUrl}/${userId}/profile`);
}

async function updateProfile(userId: string, payload: any) {
    return axios.patch(`${usersBaseUrl}/${userId}/profile`, payload, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function deleteProfile(userId: string) {
    return axios.delete(`${usersBaseUrl}/${userId}/profile`);
}

let usersToDelete: string[] = [];
let profileToDelete: string[] = [];

describe('Profile', () => {
    afterEach(() => {
        profileToDelete = [];
        usersToDelete = [];
    });

    afterEach(() => {
        if (profileToDelete.length > 0) {
            profileToDelete.forEach(async (userId: string) => {
                await deleteProfile(userId);
            });
        }

        if (usersToDelete.length > 0) {
            usersToDelete.forEach(async (userId: string) => {
                await deleteUser(userId);
            });
        }
    });

    describe("Post", () => {
        it("should already exist", async () => {
            let date = new Date();
            const d = date.toISOString().trim().replace(/-/g, "").replace(/:/g, "");;

            const payload = {
                username: `testuser-${d}@example.com`,
                first_name: "Dejan",
                last_name: "Iskra",
                password: "Lol101010@"
            }

            let response = await createUser(payload);

            expect(response.status).toBe(201);
            expect(response.data).not.toBeNull();
            expect(response.data.id).not.toBe("");

            const userId = response.data.id;
            usersToDelete.push(userId);

            let resStatus: number = 0;
            let resData: any;

            await createProfile(userId).catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });
            
            expect(resStatus).toBe(409);
            expect(resData).toBeDefined();
            expect(resData).toEqual({
                message: `Profile for userId: ${userId} already exists`,
                name: "AlreadyExistsError"
            });
        });
    });

    describe("Get", () => {
        it("should return profile", async () => {
            let date = new Date();
            const d = date.toISOString().trim().replace(/-/g, "").replace(/:/g, "");;

            const payload = {
                username: `testuser-${d}@example.com`,
                first_name: "Dejan",
                last_name: "Iskra",
                password: "Lol101010@"
            }
            
            let response = await createUser(payload);

            expect(response.status).toBe(201);
            expect(response.data).not.toBeNull();
            expect(response.data.id).not.toBe("");

            const userId = response.data.id;
            usersToDelete.push(userId);

            response = await getProfile(userId);
            
            console.log("profile...", response);
            
            expect(response.status).toBe(200);
            expect(response.data).not.toBeNull();
            // expect(response.data.id).toBe(profileId);
            expect(response.data.userId).toBe(userId);
            expect(response.data.picture_url).toBe(null);
            expect(response.data.persona).toBe(null);
            expect(response.data.work).toBe(null);
            expect(response.data.emails).toEqual([]);
            expect(response.data.phones).toEqual([]);
            expect(response.data.addresses).toEqual([]);
            expect(response.data.social).toBe(null);
            expect(typeof response.data.create_date).toBe('string');
            expect(typeof response.data.update_date).toBe('string');

            profileToDelete.push(response.data.id);
        });

        it("should not find profile", async () => {
            let resStatus: number = 0;
            let resData: any;

            await getProfile("61b1571fdc0792a51cedbe65").catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });

            expect(resStatus).toBe(404);
            expect(resData).toBeDefined();
            expect(resData).toEqual({
                message: `Profile by userId: 61b1571fdc0792a51cedbe65 not found`,
                name: "NotFoundError"
            });
        });
    });

    // describe("Patch", () => {
    //     it("should update successfully", async () => {
    //     });

    //     it("should fail validation", async () => {
    //     });

    //     it("should not find user", async () => {
    //     });
    // });

    describe("Delete", () => {
        it("should delete successfully", async () => {
            let date = new Date();
            const d = date.toISOString().trim().replace(/-/g, "").replace(/:/g, "");;

            const payload = {
                username: `testuser-${d}@example.com`,
                first_name: "Dejan",
                last_name: "Iskra",
                password: "Lol101010@"
            }

            let response = await createUser(payload);

            expect(response.status).toBe(201);
            expect(response.data).not.toBeNull();
            expect(response.data.id).not.toBe("");

            const userId = response.data.id;
            usersToDelete.push(userId);

            response = await deleteProfile(userId);
            
            expect(response.status).toBe(204);

            let resStatus: number = 0;
            let resData: any;

            await getProfile(userId).catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });;

            expect(resStatus).toBe(404);
            expect(resData).toBeDefined();
            expect(resData).toEqual({
                message: `Profile by userId: ${userId} not found`,
                name: "NotFoundError"
            });
        });

        it("should not find profile", async () => {
            let resStatus: number = 0;
            let resData: any;

            await deleteProfile("61b1571fdc0792a51cedbe65").catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });

            expect(resStatus).toBe(404);
            expect(resData).toBeDefined();
            expect(resData).toEqual({
                message: `Profile by userId: 61b1571fdc0792a51cedbe65 not found`,
                name: "NotFoundError"
            });
        });
    });
});