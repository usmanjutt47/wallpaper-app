import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from "../../constant/Theme";
import { hp, wp } from "../../helpers/Common";
import Categories from "../components/Categories";
import { apiCall } from "../../api";
import ImageGride from "../components/ImageGride";
import { debounce, filter } from "lodash";
import FilterModal from "../components/FilterModal";
import { useRoute } from "@react-navigation/native";

var page = 1;

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const modalRef = useRef(null);
  const [filters, setFilters] = useState(null);
  const scrollRef = useRef(null);
  const [isEndReached, setIsEndReached] = useState(false);
  const [router] = useRoute();

  const handleChangeCategory = (cat) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = true) => {
    let res = await apiCall(params);
    if (res.success && res?.data.hits) {
      if (append) {
        setImages([...images, ...images, ...res.data.hits]);
      } else {
        setImages([...res.data.hits]);
      }
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 2) {
      page = 1;
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, q: text, ...filters }, false);
    }
    if (text == "") {
      page = 1;
      searchInputRef?.current?.clear();
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, ...filters }, false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  const openFilersModal = () => {
    modalRef?.current?.present();
  };

  const closeFilersModal = () => {
    modalRef?.current?.close();
  };

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    console.log("applying filters");
    closeFilersModal();
  };

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilersModal();
  };

  const clearThisFilter = (filterName) => {
    let filterz = { ...filters };
    delete filterz[filterName];
    setFilters({ ...filterz });
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        console.log("reached bottom of the scrollView");
        ++page;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFilersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        showsVerticalScrollIndicator
        contentContainerStyle={{ gap: 15 }}
      >
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder="Search for photos..."
            style={styles.searchInput}
            ref={searchInputRef}
            onChangeText={handleTextDebounce}
          />
          {search && (
            <Pressable
              style={styles.closeIcon}
              onPress={() => handleSearch("")}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>
        <View style={search.categories}>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>
        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filtersItem}>
                    {key == "colors" ? (
                      <View
                        style={{
                          height: 20,
                          width: 30,
                          borderRadius: 7,
                          backgroundColor: filters[key],
                        }}
                      ></View>
                    ) : (
                      <Text style={styles.filterItemText}>{filters[key]}</Text>
                    )}

                    <Pressable
                      style={styles.filterCloseIcon}
                      onPress={() => clearThisFilter(key)}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        style={theme.colors.neutral(0.9)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View>
          {images.length > 0 && <ImageGride images={images} router={router} />}
        </View>
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size={"large"} color={theme.colors.black} />
        </View>
      </ScrollView>
      <FilterModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFilersModal}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(8),
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayGb,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
  },
  closeIcon: {
    padding: 8,
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: theme.radius.sm,
  },
  filters: {
    paddingHorizontal: wp(8),
    gap: 10,
  },
  filtersItem: {
    backgroundColor: theme.colors.grayGb,
    padding: 8,
    flexDirection: "row",
    borderRadius: theme.radius.xs,
    gap: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  filterItemText: {
    fontSize: hp(3.5),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
});
