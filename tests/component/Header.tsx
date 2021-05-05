import { useDispatch } from 'react-redux'
import renderer from 'react-test-renderer';
import Header from '@/component/Header';

jest.mock('react-redux')
const useDispatchMock = useDispatch as jest.Mock

describe('<Header />', () => {
  it('render', () => {
    useDispatchMock.mockReturnValue(jest.fn())
    const component = renderer.create( <Header/> );
  })
})
