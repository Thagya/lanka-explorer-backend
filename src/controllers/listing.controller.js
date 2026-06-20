import Listing from '../models/Listing.js'

export async function getListings(req, res) {
  try {
    const filter = { active: true }
    if (req.query.type) filter.listingType = req.query.type
    if (req.query.region) filter.region = new RegExp(req.query.region, 'i')
    const listings = await Listing.find(filter).sort({ createdAt: -1 })
    res.json(listings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getAllListings(req, res) {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 })
    res.json(listings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getListing(req, res) {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ message: 'Listing not found' })
    res.json(listing)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function createListing(req, res) {
  try {
    const listing = await Listing.create(req.body)
    res.status(201).json(listing)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function updateListing(req, res) {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    })
    if (!listing) return res.status(404).json({ message: 'Listing not found' })
    res.json(listing)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function deleteListing(req, res) {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id)
    if (!listing) return res.status(404).json({ message: 'Listing not found' })
    res.json({ message: 'Listing deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
