import React from 'react'
import ChildInfo from './ChildInfo'
import { shallow, mount } from 'enzyme'

jest.mock('../services/WishDetailsService', () => ({
  makeAWish: jest.fn(() => {
    return ({
      _id: 'mock child id'
    })
  }),
  getWishDetails: jest.fn(() => {
    return ({
      id: '',
      child: {
        firstName: '',
        lastName: ' ',
        hometown: '',
        illness: '',
        age: ''
      },
      type: '',
      details: '',
      sponsor: {
        name: '',
        logo: '',
        links: []
      },
      createdAt: '',
      updatedAt: ''
    })
  })
}));

// noinspection JSAnnotator
describe('Initial Render', () => {
  window.scrollTo = jest.fn(() => { });
  const testName = 'John'
  const age = 5;
  let childInfo;
  let childId = 'some id string'
  beforeEach(() => {
    childInfo = shallow(<ChildInfo name={testName} age={age} />);
  })

  it('renders!', () => {
    expect(childInfo.exists('.childInfo'));
    expect(childInfo.find('.text-name').text())
      .toEqual(`Hi, ${testName}. I have a few questions for you before we can make your wish come true!`);
    expect(childInfo.find('input')).toEqual({});
    expect(childInfo.instance().props.name).toEqual(testName);
    expect(childInfo.instance().state.illness).toEqual('');
  })

  describe('event listener for "Enter"', () => {
    let remover;
    beforeEach(() => {
      childInfo = mount(<ChildInfo name={testName} age={age} />);
      remover = jest
          .spyOn(global, 'removeEventListener')
          .mockImplementation(() => {});
    });

    it('Should remove event listener', () => {
      childInfo.unmount();
      expect(remover).toHaveBeenCalled();
    })
  });

  describe('enter function', () => {
    let event = {
      charCode: 0
    };

    it('Should update "step" in state on "Enter"', () => {
      event.charCode = 13;
      expect(childInfo.instance().state.step).toEqual(0);
      childInfo.instance().enter(event);
      expect(childInfo.instance().state.step).toEqual(1);
      childInfo.instance().enter(event);
      expect(childInfo.instance().state.step).toEqual(2);
    })
  });

  describe('form submit', () => {
    let event = {
      preventDefault: () => {}
    };

    beforeEach(() => {
      jest.spyOn(event, 'preventDefault');
    });

    it('Should stop page refresh', () => {
      childInfo.instance().handleFormSubmit(event);
      expect(event.preventDefault).toHaveBeenCalled();
    })
  });

  describe('step updates and progress', () => {

    it('Should update `step` in state', () => {
      expect(childInfo.instance().state.step).toEqual(0);
      childInfo.instance().nextStep();
      expect(childInfo.instance().state.step).toEqual(1);
      childInfo.instance().nextStep();
      expect(childInfo.instance().state.step).toEqual(2);
    })

    it('should update progress at top of page', async () => {
      expect(childInfo.find('.progress').text()).toEqual('1 of 3');

      childInfo.instance().nextStep();
      expect(childInfo.find('.progress').text()).toEqual('2 of 3');

      childInfo.instance().nextStep();
      expect(childInfo.find('.progress').text()).toEqual('3 of 3');
    })
  })

  describe('When user click next button', () => {
    beforeEach(() => {
      childInfo = shallow(<ChildInfo name={testName} age={age} />);
    })

    it('Should update text on button click', async () => {
      let nextButton = childInfo.find('.next-button');
      expect(childInfo.find('.text-name').text()).toEqual(`Hi, ${testName}. I have a few questions for you before we can make your wish come true!`);
      await nextButton.simulate('click');
      expect(childInfo.find('.text-name').text()).toEqual('Where are you from?');
      await nextButton.simulate('click');
      expect(childInfo.find('.text-name').text()).toEqual('Tell us more about your wish!');
      await nextButton.simulate('click');

      expect(childInfo.find('.text-name').length).toEqual(0);
      expect(childInfo.instance().state.showConfirmation).toBeTruthy();
    })
  })

  describe('When user on confirmation page, blast off the rocket', () => {
    const play = jest.fn()
    const pause = jest.fn()
    const push = jest.fn()

    beforeEach(() => {
      childInfo = shallow(<ChildInfo name={testName} age={age} />);
      childInfo.instance().setState({
        showConfirmation: true,
        isBlastOff: false
      })

      childInfo.instance().soundEffect = {
        play,
        pause
      }

      childInfo.setProps({
        history: {
          push
        }
      })
    })

    afterEach(() => {
      play.mockClear()
      pause.mockClear()
      push.mockClear()
    })

    it('Should play and pause sound effect, and push to next url', (done) => {      
      childInfo.find('.rocket-blast-off-button').simulate('click')
      setTimeout(() => {
        expect(play.mock.calls.length).toEqual(1)
        expect(pause.mock.calls.length).toEqual(1)
        expect(push.mock.calls.length).toEqual(1)
        done()
      }, 4000);
    })
  });
});
