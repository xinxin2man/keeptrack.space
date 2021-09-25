import * as externalSources from "@app/js/plugins/externalSources/externalSources"

import { expect } from "@jest/globals"
import { keepTrackApi } from "@app/js/api/externalApi"
import { keepTrackApiStubs } from "@app/js/api/apiMocks"

keepTrackApi.programs = { ...keepTrackApi.programs, ...keepTrackApiStubs.programs };
keepTrackApi.programs.settingsManager = window.settingsManager;

// @ponicode
describe("externalSources.init", () => {
    test("0", () => {
        let callFunction: any = () => {
            externalSources.init()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("externalSources.hideSideMenus", () => {
    test("0", () => {
        let callFunction: any = () => {
            externalSources.hideSideMenus()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("externalSources.n2yoFormSubmit", () => {
    test("0", () => {
        let callFunction: any = () => {
            externalSources.n2yoFormSubmit()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("externalSources.searchN2yo", () => {
    test("0", () => {
        let callFunction: any = () => {
            externalSources.searchN2yo(69660, 56784)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            externalSources.searchN2yo(true, 12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            externalSources.searchN2yo(-5.48, 34864)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            externalSources.searchN2yo(true, 12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            externalSources.searchN2yo(Infinity, Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("externalSources.bottomMenuClick", () => {
    test("0", () => {
        let callFunction: any = () => {
            externalSources.bottomMenuClick("menu-external")
            externalSources.bottomMenuClick("menu-external")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            externalSources.bottomMenuClick("")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("externalSources.celestrakFormSubmit", () => {
    test("0", () => {
        let callFunction: any = () => {
            externalSources.celestrakFormSubmit()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("externalSources.searchCelestrak", () => {
    test("0", () => {
        let callFunction: any = () => {
            externalSources.searchCelestrak(-100, 987650)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            externalSources.searchCelestrak(64832, 12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            externalSources.searchCelestrak(true, 12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            externalSources.searchCelestrak(false, 12456)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            externalSources.searchCelestrak(69660, 56784)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            externalSources.searchCelestrak(Infinity, Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})
