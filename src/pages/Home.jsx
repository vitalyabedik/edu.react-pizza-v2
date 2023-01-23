import React, { useEffect, useState } from 'react';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';

const Home = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryId, setCategoryId] = useState(0);
  const [sortType, setSortType] = useState({
    name: 'популярности',
    sortProperty: 'rating',
  });

  useEffect(() => {
    setIsLoading(true);

    const getItems = 'https://63cce64dfba6420d4d655b9d.mockapi.io/items';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc';
    const sortBy = sortType.sortProperty.replace('-', '');

    fetch(`${getItems}?${category}&sortBy=${sortBy}&order=${order}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  }, [categoryId, sortType]);

  return (
    <>
      <div className='container'>
        <div className='content__top'>
          <Categories value={categoryId} onChangeCategory={id => setCategoryId(id)} />
          <Sort value={sortType} onChangeSort={id => setSortType(id)} />
        </div>
        <h2 className='content__title'>Все пиццы</h2>
        <div className='content__items'>
          {isLoading
            ? [...new Array(6)].map((_, index) => <Skeleton key={index} />)
            : items.map(obj => <PizzaBlock key={obj.id} {...obj} />)}
        </div>
      </div>
    </>
  );
};

export default Home;
