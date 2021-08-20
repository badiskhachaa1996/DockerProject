import {PrestigePage} from './app.po';

describe('Prestige App', () => {
    let page: PrestigePage;

    beforeEach(() => {
        page = new PrestigePage();
    });

    it('should display welcome message', () => {
        page.navigateTo();
        expect(page.getTitleText()).toEqual('Welcome to Prestige!');
    });
});
