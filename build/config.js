"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    server: {
        port: 2000,
        //mode: "production"
        mode: "development"
    },
    account: {
        password: {
            salt_round: 10
        },
        thai_national_ID: {
            salt_round: 10,
            suffix_length: 5
        }
    },
    database: {
        mongodb: {
			connection_string: 'mongodb://127.0.0.1:10000/db_example', //Needed - Please change this to your own connection string
            mongoose_settings: {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        }
    },
    session: {
		secret: 'QenhZLpFg7DUmfp3hKmL2npwucu6JW', //Needed - Please change this
        saveUninitialized: false,
        resave: true,
        unset: "destroy",
        cookie: {
            secure: true,
            domain: "roswel-th.com",
            sameSite: "Lax",
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        }
    },
    jwt: { //Currently, not using jwt
		secret: 'wRrtUHzDu4UaA5EyQs66BdkAqUQqm6',
        algo: 'HS256',
        expires_in: '7d'
    },
    cors: {
        allowed_list: ['http://localhost', 'https://localhost', 'https://www.roswel-th.com', 'https://api.roswel-th.com']
    },
    kyc: {
        file_size_limit: {
            idcard: 5,
            selfie: 5,
            extra: 5,
            forAll: 15
        }
    },
    cmu_hubhoo_oauth: { //Needed external API from CMU Hubhoo oauth in order for OAuth to work properly
        redirect_path: "/redirect/login",
        user_data_callback_path: "/oauth/callback",
        login_url: "https://oauthcmu.hubhoo.com/callback?type=roswel&nonce=",
        aes: {
            encryption_key: '', //Needed
			iv: "", //Needed
            algorithm: 'aes-256-cbc',
            key_length: 32, //aes 256 => 32 char
        },
        cache: {
            timeout: 60 * 3,
            prepend_string: 'loginstr_'
        },
        require_nonce: true
    },
    log: {
        level: 5,
        service_name: "ROSWEL_BE_sv1",
        log_file: {
            error: {
                enable: true,
                file_name: "logs/error.log"
            },
            all: {
                enable: false,
                file_name: "logs/all_logs.log"
            }
        },
        log_request: {
            enable: false,
        },
        grafana_loki: {
            enable: false, //Optional
            config: {
				host: '', // Needed if enabled
                json: true,
                basicAuth: '', // Needed if enabled
                labels: { job: 'dev' }
            }
        }
    },
    sms: {
		enable: true, // Currently using thsms
        verification: {
            spam_prevention: {
                cooldown: 60 * 2,
                redis_prepend_string: 'sms_cd_'
            },
        },
        providers: {
            twilio: {
                auth: {
                    accountSid: '',
                    authToken: '',
                    serviceID: ''
                }
            },
            thaibulksms: {
                auth: {
                    username: "",
                    password: "" //or API secret
                },
                sender_name: 'Demo'
            },
            thsms: {
                auth: {
                    apiKey: '' //Needed
                }
            }
        }
    },
    email: {
        enable: true,
        verification: {
            spam_prevention: {
                cooldown: 60 * 3,
                redis_prepend_string: 'email_cd_'
            },
            subject: '[ROSWEL-TH] Complete your registration',
            image_url: 'https://www.roswel-th.com/dist/image/logo/ROSWEL_logo_wbg.png',
            web_title: 'Email Verification Request | ROSWEL-TH',
            verification_url_prefix: 'https://www.roswel-th.com/email-verify/',
            provider: 'sendGrid',
            code_length: 24
        },
        providers: {
            sendGrid: {
                //Free 100 emails/day
				sender_email: '', //Needed
				apiKey: '' //Needed
            },
            SendInBlue: {
				sender_email: '', 
                apiKey: '' 
            },
            SMTP: { //Not enabled in current version
                SMTP_transport_configs: {
                    ROSWEL_Google: {
                        //free 500 mails per day
                        host: "smtp.gmail.com",
                        port: 587,
                        secureConnection: true,
                        auth: {
                            user: "",
                            pass: "",
                        },
                        tls: {
                            ciphers: 'SSLv3'
                        }
                    }
                }
            }
        }
    }
};
