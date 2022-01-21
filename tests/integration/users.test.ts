import axios, { AxiosResponse } from 'axios';

const usersBaseUrl = "http://localhost:7000/api/v1/users";

async function createUser(payload: any) {
    return await axios.post(usersBaseUrl, payload, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function getUserById(userId: string) {
    return axios.get(`${usersBaseUrl}/${userId}`);
}

async function searchUser(queryParams: string) {
    return axios.get(`${usersBaseUrl}?${queryParams}`);
}

async function updateUser(userId: string, payload: any) {
    return axios.put(`${usersBaseUrl}/${userId}`, payload, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function deleteUser(userId: string) {
    return axios.delete(`${usersBaseUrl}/${userId}`);
}

let usersToDelete: string[] = [];

describe('Users', () => {
    beforeEach(() => {
        // console.log(`Users - Before each users: ${usersToDelete.length}`);
        usersToDelete = [];
    });

    afterEach(() => {
        // console.log(`Users - After each users: ${usersToDelete.length}`);
        if (usersToDelete.length > 0) {
            usersToDelete.forEach(async (userId: string) => {
                await deleteUser(userId);
            });
        }
    });

    describe("Post", () => {
        it("should create and return a user id", async () => {
            let date = new Date();
            const d = date.toISOString().trim().replace(/-/g, "").replace(/:/g, "");;

            const payload = {
                username: `testuser-${d}@example.com`,
                first_name: "Dejan",
                last_name: "Iskra",
                password: "Lol101010@"
            }
            
            const response = await createUser(payload);

            expect(response.status).toBe(201);
            expect(response.data).not.toBeNull();
            expect(response.data.id).not.toBe("");

            usersToDelete.push(response.data.id);
        });

        it("should already exist", async () => {
            let date = new Date();
            const d = date.toISOString().trim().replace(/-/g, "").replace(/:/g, "");;

            const payload = {
                username: `testuser-${d}@example.com`,
                first_name: "Dejan",
                last_name: "Iskra",
                password: "Lol101010@"
            }

            const response = await createUser(payload);
            usersToDelete.push(response.data.id);

            let resStatus: number = 0;
            let resData: any;

            await createUser(payload).catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });
            
            expect(resStatus).toBe(409);
            expect(resData).toBeDefined();
            expect(resData).toEqual({
                message: `Username ${payload.username} already exists`,
                name: "AlreadyExistsError"
            });
        });

        it("should fail validation", async () => {
            const payload = {
                username: `testuser-${new Date().toISOString().trim()}example.com`,
                first_name: "",
                last_name: "",
                password: "pw"
            }

            let resStatus: number = 0;
            let resData: any;

            await createUser(payload).catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });
            
            expect(resStatus).toBe(400);
            expect(resData).toBeDefined();
            expect(resData.validation_errors.length).toBe(4);
            expect(resData.validation_errors[0].msg).toBe("Invalid value");
            expect(resData.validation_errors[0].param).toBe("username");
            expect(resData.validation_errors[0].location).toBe("body");

            expect(resData.validation_errors[1].value).toBe("pw");
            expect(resData.validation_errors[1].msg).toBe("Invalid value");
            expect(resData.validation_errors[1].param).toBe("password");
            expect(resData.validation_errors[1].location).toBe("body");

            expect(resData.validation_errors[2].value).toBe("");
            expect(resData.validation_errors[2].msg).toBe("Invalid value");
            expect(resData.validation_errors[2].param).toBe("first_name");
            expect(resData.validation_errors[2].location).toBe("body");

            expect(resData.validation_errors[3].value).toBe("");
            expect(resData.validation_errors[3].msg).toBe("Invalid value");
            expect(resData.validation_errors[3].param).toBe("last_name");
            expect(resData.validation_errors[3].location).toBe("body");
        });
    });

    describe("Get", () => {
        it("should return user", async () => {
            let date = new Date();
            const d = date.toISOString().trim().replace(/-/g, "").replace(/:/g, "");;

            const payload = {
                username: `testuser-${d}@example.com`,
                first_name: "Dejan",
                last_name: "Iskra",
                password: "Lol101010@"
            }

            const user = await createUser(payload);
            usersToDelete.push(user.data.id);

            let response = await getUserById(user.data.id);

            expect(response.status).toBe(200);
            expect(response.data).not.toBeNull();
            expect(response.data.id).toBe(user.data.id);
            expect(response.data.username).toBe(payload.username);
            expect(response.data.first_name).toBe(payload.first_name);
            expect(response.data.last_name).toBe(payload.last_name);
            expect(response.data.active).toBe(true);
            expect(response.data.locked).toBe(null);
            expect(typeof response.data.create_date).toBe('string');
            expect(typeof response.data.update_date).toBe('string');

            response = await searchUser(`username=${payload.username}`);

            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
            expect(response.data.length > 0).toEqual(true);
            
            response = await searchUser(`first_name=${payload.first_name}`)

            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
            expect(response.data.length > 0).toEqual(true);

            response = await searchUser(`last_name=${payload.last_name}`);

            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
            expect(response.data.length > 0).toEqual(true);

            response = await searchUser(`first_name=${payload.first_name}&last_name=${payload.last_name}`);

            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
            expect(response.data.length > 0).toEqual(true);
        });

        it("should not find user", async () => {
            let resStatus: number = 0;
            let resData: any;

            await getUserById("61b1764de6e36922254d379f").catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });
            
            expect(resStatus).toBe(404);
            expect(resData).toBeDefined();
            expect(resData).toEqual({
                message: "User id: 61b1764de6e36922254d379f not found",
                name: "NotFoundError"
            });

            let res = await searchUser("username=bruh@gmail.com");

            expect(res.status).toBe(200);
            expect(res.data).toBeDefined();
            expect(res.data).toEqual([]);

            res = await searchUser("first_name=Troll");

            expect(res.status).toBe(200);
            expect(res.data).toBeDefined();
            expect(res.data).toEqual([]);

            res = await searchUser("last_name=Troll");

            expect(res.status).toBe(200);
            expect(res.data).toBeDefined();
            expect(res.data).toEqual([]);

            res = await searchUser("first_name=Troll&last_name=Troll");

            expect(res.status).toBe(200);
            expect(res.data).toBeDefined();
            expect(res.data).toEqual([]);
        });

        it("should fail validation", async () => {
            let resStatus: number = 0;
            let resData: any;

            await searchUser("first_name=543").catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });
            
            expect(resStatus).toBe(400);
            expect(resData).toBeDefined();
            expect(resData.validation_errors[0].value).toBe("543");
            expect(resData.validation_errors[0].msg).toBe("Invalid value");
            expect(resData.validation_errors[0].param).toBe("first_name");
            expect(resData.validation_errors[0].location).toBe("query");

            await searchUser("last_name=543").catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });

            expect(resStatus).toBe(400);
            expect(resData).toBeDefined();
            expect(resData.validation_errors[0].value).toBe("543");
            expect(resData.validation_errors[0].msg).toBe("Invalid value");
            expect(resData.validation_errors[0].param).toBe("last_name");
            expect(resData.validation_errors[0].location).toBe("query");

            await searchUser("username=543").catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });

            expect(resStatus).toBe(400);
            expect(resData).toBeDefined();
            expect(resData.validation_errors[0].value).toBe("543");
            expect(resData.validation_errors[0].msg).toBe("Invalid value");
            expect(resData.validation_errors[0].param).toBe("username");
            expect(resData.validation_errors[0].location).toBe("query");
        });
    });

    describe("Put", () => {
        it("should update successfully", async () => {
            let date = new Date();
            const d = date.toISOString().trim().replace(/-/g, "").replace(/:/g, "");;

            const createPayload = {
                username: `testuser-${d}@example.com`,
                first_name: "Dejan",
                last_name: "Iskra",
                password: "Lol101010@"
            }

            let response = await createUser(createPayload);
            
            expect(response.status).toBe(201);
            expect(response.data).not.toBeNull();
            expect(response.data.id).not.toBe("");

            const userId = response.data.id;
            usersToDelete.push(userId);

            const updatePayload = {
                first_name: "Kobe",
                last_name: "Bryant",
                locked: true,
                active: false
            };

            response = await updateUser(userId, updatePayload);

            expect(response.status).toBe(204);

            response = await getUserById(userId);

            expect(response.status).toBe(200);
            expect(response.data).not.toBeNull();
            expect(response.data.id).toBe(response.data.id);
            expect(response.data.first_name).toBe(updatePayload.first_name);
            expect(response.data.last_name).toBe(updatePayload.last_name);
            expect(response.data.active).toBe(false);
            expect(typeof response.data.locked).toBe("string");
            expect(typeof response.data.create_date).toBe('string');
            expect(typeof response.data.update_date).toBe('string');
        });

        it("should fail validation", async () => {
            let date = new Date();
            const d = date.toISOString().trim().replace(/-/g, "").replace(/:/g, "");;

            const createPayload = {
                username: `testuser-${d}@example.com`,
                first_name: "Dejan",
                last_name: "Iskra",
                password: "Lol101010@"
            }

            let response = await createUser(createPayload);

            expect(response.status).toBe(201);
            expect(response.data).not.toBeNull();
            expect(response.data.id).not.toBe("");

            const userId = response.data.id;
            usersToDelete.push(userId);

            const updatePayload = {
                first_name: "",
                last_name: "",
                locked: "1990-12-16",
                active: false
            };

            let resStatus: number = 0;
            let resData: any;

            await updateUser(userId, updatePayload).catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });

            expect(resStatus).toBe(400);
            expect(resData).toBeDefined();
            
            expect(resData.validation_errors[0].value).toBe("");
            expect(resData.validation_errors[0].msg).toBe("Invalid value");
            expect(resData.validation_errors[0].param).toBe("first_name");
            expect(resData.validation_errors[0].location).toBe("body");

            expect(resData.validation_errors[1].value).toBe("");
            expect(resData.validation_errors[1].msg).toBe("Invalid value");
            expect(resData.validation_errors[1].param).toBe("last_name");
            expect(resData.validation_errors[1].location).toBe("body");
        });

        it("should not find user", async () => {
            const updatePayload = {
                first_name: "Dejan",
                last_name: "Iskra",
                locked: "1990-12-16",
                active: false
            };

            let resStatus: number = 0;
            let resData: any;

            await updateUser("61b1764de6e36922254d379f", updatePayload).catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });

            expect(resStatus).toBe(404);
            expect(resData).toBeDefined();
            expect(resData).toEqual({
                message: "User id: 61b1764de6e36922254d379f not found",
                name: "NotFoundError"
            });
        });
    });

    describe("Delete", () => {
        it("should delete successfully", async () => {
            let date = new Date();
            const d = date.toISOString().trim().replace(/-/g, "").replace(/:/g, "");;

            const createPayload = {
                username: `testuser-${d}@example.com`,
                first_name: "Dejan",
                last_name: "Iskra",
                password: "Lol101010@"
            }

            let response = await createUser(createPayload);

            expect(response.status).toBe(201);
            expect(response.data).not.toBeNull();
            expect(response.data.id).not.toBe("");

            const userId = response.data.id;

            response = await deleteUser(userId);

            expect(response.status).toBe(204);

            let resStatus: number = 0;
            let resData: any;

            await getUserById(userId)
                .catch(error => {
                    resData = error.response.data;
                    resStatus = error.response.status;
                });

            expect(resStatus).toBe(404);
        });

        it("should not find user", async () => {
            let resStatus: number = 0;
            let resData: any;

            await deleteUser("61b1571fdc0792a51cedbe65").catch(error => {
                resData = error.response.data;
                resStatus = error.response.status;
            });

            expect(resStatus).toBe(404);
            expect(resData).toBeDefined();
            expect(resData).toEqual({
                message: "User id: 61b1571fdc0792a51cedbe65 not found",
                name: "NotFoundError"
            });
        });
    });
});