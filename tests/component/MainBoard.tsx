import { useSelector, useDispatch } from 'react-redux'
import renderer from 'react-test-renderer';
import { initialState as initNodeState } from '@/store/main/reducer';
import MainBoard from '@/component/MainBoard';

jest.mock('react-redux')
const useSelectorMock = useSelector as jest.Mock
const useDispatchMock = useDispatch as jest.Mock

describe('<MainBoard />', () => {
  test('render', () => {
    useSelectorMock.mockReturnValueOnce(initNodeState).mockReturnValue(initNodeState)
    useDispatchMock.mockReturnValue(jest.fn())
    const component = renderer.create( <MainBoard/> );
    expect(component).toMatchSnapshot();
  });
});
