"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_1 = require("../src/lib/firebase");
var firestore_1 = require("firebase/firestore");
var playersToImport = [
    {
        "id": "1",
        "name": "Cedric Lebas"
    },
    {
        "id": "2",
        "name": "Erwan Anfray"
    },
    {
        "id": "3",
        "name": "Ewen Bersot"
    },
    {
        "id": "4",
        "name": "François Beaudouin"
    },
    {
        "id": "5",
        "name": "Guillaume Pévrier"
    },
    {
        "id": "6",
        "name": "Jean Romu"
    },
    {
        "id": "7",
        "name": "Laurent Collet"
    },
    {
        "id": "8",
        "name": "Max Fremont"
    },
    {
        "id": "9",
        "name": "Nicolas Ge"
    },
    {
        "id": "10",
        "name": "Rom Savatte"
    },
    {
        "id": "11",
        "name": "Vincent Poilvet"
    },
    {
        "id": "12",
        "name": "Drd Julien"
    },
    {
        "id": "13",
        "name": "Germain Mqn"
    },
    {
        "id": "14",
        "name": "Jérémy Aubert"
    },
    {
        "id": "15",
        "name": "Nicolas Beillard"
    },
    {
        "id": "16",
        "name": "Dimitri Hudin"
    },
    {
        "id": "17",
        "name": "Yann Uvy"
    },
    {
        "id": "18",
        "name": "Yoann Poulain"
    },
    {
        "id": "19",
        "name": "Léo Briantais"
    },
    {
        "id": "20",
        "name": "Thibault Smolevsky"
    },
    {
        "id": "21",
        "name": "Kévin MH"
    },
    {
        "id": "22",
        "name": "Alexander Alessandro"
    },
    {
        "id": "23",
        "name": "Nico Lamacq"
    },
    {
        "id": "24",
        "name": "Jaddour Omar"
    },
    {
        "id": "25",
        "name": "Nicolas Gousset"
    },
    {
        "id": "26",
        "name": "Martin Lbn"
    },
    {
        "id": "27",
        "name": "Vincent Bourdoiseau"
    },
    {
        "id": "28",
        "name": "Alecs Gen"
    },
    {
        "id": "29",
        "name": "Amine Rhidane"
    }
];
function importPlayersToFirestore() {
    return __awaiter(this, void 0, void 0, function () {
        var playersCollection, _i, playersToImport_1, player, playerDocRef, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting player import to Firestore...');
                    playersCollection = (0, firestore_1.collection)(firebase_1.db, 'players');
                    _i = 0, playersToImport_1 = playersToImport;
                    _a.label = 1;
                case 1:
                    if (!(_i < playersToImport_1.length)) return [3 /*break*/, 6];
                    player = playersToImport_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    playerDocRef = (0, firestore_1.doc)(playersCollection, player.id);
                    return [4 /*yield*/, (0, firestore_1.setDoc)(playerDocRef, { name: player.name })];
                case 3:
                    _a.sent();
                    console.log("Successfully imported player: ".concat(player.name, " with ID: ").concat(player.id));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error importing player ".concat(player.name, " with ID ").concat(player.id, ":"), error_1);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log('Player import process finished.');
                    return [2 /*return*/];
            }
        });
    });
}
importPlayersToFirestore();
// To run this script, you would typically call the function:
// importPlayersToFirestore();
// You might need to set up a way to execute this script,
// for example, by adding it to your package.json scripts
// or running it with ts-node.
