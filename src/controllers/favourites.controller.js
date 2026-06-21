import User from '../models/User.js'
import Attraction from '../models/Attraction.js'
import Listing from '../models/Listing.js'
import mongoose from 'mongoose'

const isBadId = (id) => !mongoose.Types.ObjectId.isValid(id)
const ALLOWED_TYPES = ['attraction', 'listing']

export async function getFavourites(req, res) {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })
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
    if (!itemId || !itemType)
      return res.status(400).json({ message: 'itemId and itemType are required' })
    if (!ALLOWED_TYPES.includes(itemType))
      return res.status(400).json({ message: 'itemType must be attraction or listing' })
    if (isBadId(itemId))
      return res.status(400).json({ message: 'Invalid itemId' })

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const already = user.favourites.some(
      f => f.itemId.toString() === itemId && f.itemType === itemType
    )
    if (!already) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { favourites: { itemId, itemType } }
      })
    }
    res.json({ message: 'Added to favourites' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function removeFavourite(req, res) {
  try {
    if (isBadId(req.params.itemId))
      return res.status(400).json({ message: 'Invalid itemId' })
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { favourites: { itemId: req.params.itemId } }
    })
    res.json({ message: 'Removed from favourites' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
