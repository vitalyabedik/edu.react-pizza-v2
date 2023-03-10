import qs from 'qs';
import { Link, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../redux/store';

import { Sort, Categories, PizzaBlock, Skeleton, Pagination } from '../components';

import { sortList } from '../components/Sort';
import { pizzaDataSelector } from '../redux/pizza/selectors';
import { filterSelector } from '../redux/filter/selectors';
import { setCategoryId, setCurrentPage } from '../redux/filter/slice';
import { fetchPizzas } from '../redux/pizza/asyncActions';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const { items, status } = useSelector(pizzaDataSelector);
  const { categoryId, sort, currentPage, searchValue } = useSelector(filterSelector);
  const sortType = sort.sortProperty;

  const onChangeCategory = useCallback((id: number) => {
    dispatch(setCategoryId(id));
  }, []);

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const getPizzas = async () => {
    const getItems = 'https://63cce64dfba6420d4d655b9d.mockapi.io/items';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const order = sortType.includes('-') ? 'asc' : 'desc';
    const sortBy = sortType.replace('-', '');
    const search = searchValue ? `search=${searchValue}` : '';

    dispatch(
      fetchPizzas({
        getItems,
        category,
        order,
        sortBy,
        search,
        currentPage: String(currentPage),
      }),
    );

    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getPizzas();
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  // Если был первый рендер, то проверяем URL-параметры и сохраняем в Redux-е
  // useEffect(() => {
  //   if (window.location.search) {
  //     const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;

  //     const sort = sortList.find(obj => obj.sortProperty === params.sortBy);

  //     dispatch(
  //       setFilters({
  //         searchValue: params.search,
  //         categoryId: Number(params.category),
  //         currentPage: Number(params.currentPage),
  //         sort: sort || sortList[0],
  //       }),
  //     );
  //     isSearch.current = true;
  //   }
  // }, []);

  // // Если был первый рендер, то запрашиваем данные (пиццы)
  // useEffect(() => {
  //   if (!isSearch.current) {
  //     getPizzas();
  //   }

  //   isSearch.current = false;
  // }, [categoryId, sortType, searchValue, currentPage]);

  // // Если изменили параметры и был первый рендер
  // useEffect(() => {
  //   if (isMounted.current) {
  //     const queryString = qs.stringify({
  //       sortProperty: sort.sortProperty,
  //       categoryId,
  //       currentPage,
  //     });

  //     navigate(`?${queryString}`);
  //   }
  //   isMounted.current = true;
  // }, [categoryId, sortType, searchValue, currentPage]);

  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <>
      <div className='container'>
        <div className='content__top'>
          <Categories value={categoryId} onChangeCategory={onChangeCategory} />
          <Sort value={sort} />
        </div>
        <h2 className='content__title'>Все пиццы</h2>
        {status === 'error' ? (
          <div className='content__error-info'>
            <h2>
              Произошла ошибка <span>😕</span>
            </h2>
            <p>К сожалению, не удалось получить пиццы. Попробуйте повторить попытку позже.</p>
          </div>
        ) : (
          <div className='content__items'>{status === 'loading' ? skeletons : pizzas}</div>
        )}
        <Pagination currentPage={currentPage} onChangePage={onChangePage} />
      </div>
    </>
  );
};

export default Home;
