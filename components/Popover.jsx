{
  /** Add popover with options */
}
<View
  className={`flex-row items-center bg-slate-800 z-40 py-3 rounded-xl ${
    show ? "bg-blue-500 px-2 space-x-3" : "space-x-1"
  }`}
>
  {/** Add favorite button if favorite */}
  {item.fav && !show && (
    <TouchableOpacity
      title="Submit"
      activeOpacity={0.75}
      onPress={() => {
        handleFavorite(item);
      }}
      className=""
    >
      <MaterialCommunityIcons name="cards-heart" size={24} color="#3b82f6" />
    </TouchableOpacity>
  )}
  {/** Open popover */}
  {show && (
    <View className="flex-row items-center space-x-3">
      {/** Add delete button */}
      <TouchableOpacity
        title="Submit"
        activeOpacity={0.75}
        onPress={() => handleRemove(item)}
        className=""
      >
        <MaterialCommunityIcons name="delete" size={24} color="white" />
      </TouchableOpacity>

      {/** Add edit button */}
      <TouchableOpacity
        title="Submit"
        activeOpacity={0.75}
        onPress={() => {
          setEdit(true);
          setShow(false);
        }}
        className=""
      >
        <Ionicons name="create-outline" size={24} color="white" />
      </TouchableOpacity>

      {/** Add favorite button */}
      <TouchableOpacity
        title="Submit"
        activeOpacity={0.75}
        onPress={() => {
          handleFavorite(item);
        }}
        className="ml-2"
      >
        <MaterialCommunityIcons
          name={item.fav ? "heart-off" : "cards-heart-outline"}
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  )}
  <TouchableOpacity
    title="Submit"
    activeOpacity={0.75}
    onPress={() => setShow(!show)}
  >
    <MaterialCommunityIcons
      name={show ? "close" : "dots-vertical"}
      size={24}
      color="white"
    />
  </TouchableOpacity>
</View>;
