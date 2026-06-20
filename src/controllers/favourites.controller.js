import User from '../models/User.js'
import Attraction from '../models/Attraction.js'
import Listing from '../models/Listing.js'

export async function getFavourites(req, res) {
  try {
    const user = await User.findById(req.user._id)
    const favs = user.favourites || []
    const attractionIds = favs.filter(f => f.itemType === 'attraction').map(f => f.itemId)
    const listingIds    = favs.filter(f => f.itemType === 'listing').map(f => f.itemId)
    const [attractions, listings] = await Promise.all([
      Attraction.find({ _id: { $in: attractionIds } }),
      Listing.find({ _id: { $in: listingIds } }),
    ])
    res.json({ attractions, listings })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function addFavourite(req, res) {
  try {
    const { itemId, itemType } = req.body
    const user = await User.findById(req.user._id)
    const already = user.favourites.some(f => f.itemId.toString() === itemId && f.itemType === itemType)
    if (!already) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { favourites: { itemId, itemType } }
      })
    }
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function removeFavourite(req, res) {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { favourites: { itemId: req.params.itemId } }
    })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
